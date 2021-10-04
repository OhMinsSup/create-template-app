import React from 'react';
import type { PostModel } from 'type/app-api';

const PostViewer: React.FC<{ post: PostModel }> = ({ post }) => {
  return (
    <div className="post-viewer">
      <h1 className="title">{post.title}</h1>
      <div className="meta">
        <span className="username">
          by <b>{post.username}</b>
        </span>
        <span className="separator">&middot;</span>
        <span className="date">{post.createdAt}</span>
      </div>
      <div className="body">{post.body}</div>
    </div>
  );
};

export default PostViewer;
