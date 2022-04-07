import React from 'react';

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = (props) => {
  return <>{props.children}</>;
};

export default Loading;
