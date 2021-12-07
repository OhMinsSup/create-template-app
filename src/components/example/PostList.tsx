import React from 'react';
import Post from './Post';
import type { ExampleSchema } from 'type/schema/example';

interface PostListProps {
  posts: ExampleSchema[];
}
const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default PostList;
