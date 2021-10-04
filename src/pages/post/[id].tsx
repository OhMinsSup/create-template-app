import React from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import AppLayout from '@components/example/AppLayout';
import PostViewer from '@components/example/PostViewer';

import { api } from '@api/module';

import type { PostModel } from 'type/app-api';
import type { InferGetStaticPropsType } from 'next';

// This function gets called at build time
export async function getStaticPaths() {
  const { data: posts } = await api.getMockResponse<PostModel[]>(
    'posts?page=1&limit=10',
  );

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: 'blocking' };
}

// This also gets called at build time
export async function getStaticProps({ params }: any) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const { data: post } = await api.getMockResponse<PostModel>(
    `posts/${params.id}`,
  );

  // Pass post data to the page via props
  return { props: { post }, revalidate: 60 * 5 };
}

function Post({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const id = router.query.id?.toString() ?? null;

  const { data, error } = useSWR<PostModel>(
    id ? `posts/${id}` : null,
    (url: string) => api.getMockResponse(url).then((data) => data.data),
    {
      fallbackData: post,
    },
  );

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (error) return 'An error has occurred.';
  if (!data) return 'Loading...';

  return (
    <div className="responsive">
      <PostViewer post={data} />
    </div>
  );
}

export default Post;

Post.Layout = AppLayout;
