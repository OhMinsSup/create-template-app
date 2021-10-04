import React from 'react';
import Post from './Post';

const PostList: React.FC<{ posts: any[] }> = ({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default PostList;
