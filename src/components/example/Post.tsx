import React from 'react';
import Link from 'next/link';

const Post: React.FC<{ post: any }> = ({ post }) => {
  return (
    <div className="post-item" key={post.id}>
      <Link href={`/post/${post.id}`}>
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
