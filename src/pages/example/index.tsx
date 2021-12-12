import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

// hooks
import useSWR from 'swr';

// components
import Post from '@components/example/Post';
import Pagination from '@components/example/Pagination';

// api
import { api } from '@api/module';

// types
import type { InferGetStaticPropsType } from 'next';
import type { ExampleSchema } from '@api/schema/example';
import { SEO } from '@components/common/SEO';

const AppLayout = dynamic(() => import('@components/example/AppLayout'), {
  ssr: false,
});

// 이 함수는 서버 측에서 빌드시 호출됩니다.
// 서버리스 함수에서 다시 호출 될 수 있습니다.
// 재 검증이 활성화되고 새 요청이 들어옵니다
export async function getStaticProps() {
  const { data: posts } = await api.getMockResponse<ExampleSchema[]>(
    'posts?page=1&limit=10',
  );

  return {
    props: {
      posts,
    },
    // Next.js는 페이지 재생성을 시도합니다.
    // - 요청이 들어올 때
    // - 최대 10초마다 한 번
    revalidate: 60 * 5, // In seconds
  };
}

function PostPage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR<ExampleSchema[]>(
    `posts?page=${page}&limit=10`,
    (url: string) => api.getMockResponse(url).then((data) => data.data),
    {
      fallbackData: posts,
    },
  );

  const fetchNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const fetchPrevPage = useCallback(() => {
    setPage((prev) => prev - 1);
  }, []);

  if (error) return 'An error has occurred.';
  if (!data) return 'Loading...';

  return (
    <>
      <SEO title="포스트 | web-boilerplate" description="포스트 리스트 내용" />
      <div className="responsive post-list">
        {data.map((post) => (
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

PostPage.Layout = AppLayout;
