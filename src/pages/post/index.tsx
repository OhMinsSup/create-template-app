import { useCallback, useState } from 'react';
import useSWR from 'swr';

import AppLayout from '@components/example/AppLayout';
import Post from '@components/example/Post';
import Pagination from '@components/example/Pagination';

import { api } from '@api/module';

import type { InferGetStaticPropsType } from 'next';
import type { PostModel } from 'type/app-api';

// 이 함수는 서버 측에서 빌드시 호출됩니다.
// 서버리스 함수에서 다시 호출 될 수 있습니다.
// 재 검증이 활성화되고 새 요청이 들어옵니다
export async function getStaticProps() {
  const { data: posts } = await api.getMockResponse<PostModel[]>(
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
  const { data, error } = useSWR<PostModel[]>(
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
  );
}

export default PostPage;

PostPage.Layout = AppLayout;
