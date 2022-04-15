import React from 'react';
import dynamic from 'next/dynamic';
import isbot from 'isbot';

// hooks
import useSWR from 'swr';
import { useRouter } from 'next/router';

// components
import PostViewer from '@components/example/PostViewer';

// api
import { api } from '@api/module';

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import type { ExampleSchema } from '@api/schema/example';
import { Seo } from '@components/ui/Seo';
import { DefaultImageUrl, Title } from '@components/ui/Seo/Seo';
import type { NextSeoProps } from 'next-seo';
import { SITE_URL } from '@contants/env';
import { PAGE_ENDPOINTS } from '@contants/constant';

const AppLayout = dynamic(() => import('@components/example/AppLayout'), {
  ssr: false,
});

const getServerSidePostProps = async (context: GetServerSidePropsContext) => {
  const userAgent = context.req.headers['x-viewer-user-agent'];
  if (userAgent) {
    const isBotRequest = isbot(userAgent);
    if (isBotRequest) {
      const id = context.query.id?.toString();
      if (!id) {
        return {
          props: {
            userAgent,
            isBotRequest: true,
          },
        };
      }

      try {
        const { data: post } = await api.getMockResponse<ExampleSchema>(
          `posts/${id}`,
        );

        const title = `${Title} -  포스트 (${post.title})`;

        const seo: NextSeoProps = {
          title,
          description: title,
          openGraph: {
            title,
            description: title,
            url: `${SITE_URL}${PAGE_ENDPOINTS.EXAMPLE.DETAIL(id)}`,
            site_name: Title,
            type: 'article',
            images: [
              {
                url: DefaultImageUrl,
                alt: Title,
              },
            ],
          },
        };

        return {
          props: {
            seo,
            userAgent,
            isBotRequest: true,
          },
        };
      } catch (error) {
        return {
          props: {
            userAgent,
            isBotRequest: true,
          },
        };
      }
    }
  }

  return {
    props: {
      userAgent,
      isBotRequest: false,
    },
  };
};

function Post({
  seo,
  userAgent,
  isBotRequest,
}: InferGetServerSidePropsType<typeof getServerSidePostProps>) {
  console.log('userAgent =======>', userAgent);
  const router = useRouter();
  const id = router.query.id?.toString() ?? null;

  const getKey = () => {
    if (!id) return null;
    return `posts/${id}`;
  };

  const wrappedFetcher = async (url: string) => {
    const response = await api.getMockResponse(url).then((data) => data.data);
    if (!response) return null;
    return response;
  };

  const { data } = useSWR<ExampleSchema>(getKey, wrappedFetcher);

  // bot에게 노출되는 seo 정보
  if (seo && isBotRequest) {
    return (
      <div>
        <Seo {...seo} />
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${data?.title} | web-boilerplate`}
        description={data?.title}
      />
      <div className="responsive">
        {data ? <PostViewer post={data} /> : 'Loading...'}
      </div>
    </>
  );
}

export default Post;

Post.Layout = AppLayout;

export const getServerSideProps = getServerSidePostProps;
