import React from 'react';

interface EmptyProps {
  children?: React.ReactNode;
}

function Empty(props: EmptyProps) {
  return <>{props.children}</>;
}

export default Empty;
