import React from 'react';
import Link from 'next/link';
import type { ExampleSchema } from '@api/schema/example';
import { PAGE_ENDPOINTS } from '@contants/constant';

interface PostProps {
  post: ExampleSchema;
}
const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="post-item" key={post.id}>
      <Link href={PAGE_ENDPOINTS.EXAMPLE.DETAIL(post.id)}>
        <a className="title">{post.title}</a>
      </Link>
      <div className="meta">
        <span className="username">
          by <b>{post.username}</b>
        </span>
        <span className="separator">&middot;</span>
        <span className="date">{post.createdAt}</span>
      </div>
      <p>{post.body}</p>
    </div>
  );
};

export default Post;
