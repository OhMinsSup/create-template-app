import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import isbot from 'isbot';

// hooks
import useSWR from 'swr';

// components
import Post from '@components/example/Post';
import Pagination from '@components/example/Pagination';
import { Seo } from '@components/ui/Seo';

// api
import { api } from '@api/module';

// types
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import type { ExampleSchema } from '@api/schema/example';
import type { NextSeoProps } from 'next-seo';
import { SITE_URL } from '@contants/env';
import { PAGE_ENDPOINTS } from '@contants/constant';
import { DefaultImageUrl, Title } from '@components/ui/Seo/Seo';

const AppLayout = dynamic(() => import('@components/example/AppLayout'), {
  ssr: true,
});

const getServerSidePostsProps = (context: GetServerSidePropsContext) => {
  const userAgent = context.req.headers?.['x-viewer-user-agent'];
  if (userAgent) {
    const isBotRequest = isbot(userAgent);
    if (isBotRequest) {
      try {
        const title = `${Title} -  포스트`;

        const seo: NextSeoProps = {
          title,
          description: title,
          openGraph: {
            title,
            description: title,
            url: `${SITE_URL}${PAGE_ENDPOINTS.EXAMPLE.ROOT}`,
            site_name: Title,
            type: 'website',
            images: [
              {
                url: DefaultImageUrl,
                alt: Title,
              },
            ],
          },
        };
        console.log(seo);
        return {
          props: {
            seo,
            isBotRequest: true,
          },
        };
      } catch (error) {
        return {
          props: {
            isBotRequest: true,
          },
        };
      }
    }
  }

  return {
    props: {
      isBotRequest: false,
    },
  };
};

function PostPage({
  seo,
  isBotRequest,
}: InferGetServerSidePropsType<typeof getServerSidePostsProps>) {
  const [page, setPage] = useState(1);
  const { data } = useSWR<ExampleSchema[]>(
    `posts?page=${page}&limit=10`,
    (url: string) => api.getMockResponse(url).then((data) => data.data),
  );

  const fetchNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const fetchPrevPage = useCallback(() => {
    setPage((prev) => prev - 1);
  }, []);

  return (
    <>
      {seo && isBotRequest ? (
        <Seo {...seo} />
      ) : (
        <Seo
          title="포스트 | web-boilerplate"
          description="포스트 리스트 내용"
        />
      )}
      <div className="responsive post-list">
        {(data ?? []).map((post) => (
          <Post key={post.id} post={post} />
        ))}
        <Pagination
          page={page}
          lastPage={10}
          fetchNextPage={fetchNextPage}
          fetchPrevPage={fetchPrevPage}
        />
      </div>
    </>
  );
}

export default PostPage;

export const getServerSideProps = getServerSidePostsProps;

PostPage.Layout = AppLayout;
