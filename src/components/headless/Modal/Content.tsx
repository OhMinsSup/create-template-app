import React from 'react';

export interface ContentProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;

  // props
  descriptionProps?: React.ReactNode;
  footerProps?: React.HTMLAttributes<HTMLDivElement>;
  bodyProps?: React.HTMLAttributes<HTMLDivElement>;
  titleProps?: React.HTMLAttributes<HTMLDivElement>;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
}

const Content: React.FC<ContentProps> = ({
  footer,
  title,
  content,
  bodyProps,
  footerProps,
  titleProps,
  descriptionProps,
  contentProps,
}) => {
  let footerNode: React.ReactNode;
  if (footer) {
    footerNode = <div {...footerProps}>{footer}</div>;
  }

  let headerNode: React.ReactNode;
  if (title) {
    headerNode = <div {...titleProps}>{title}</div>;
  }

  let descriptionNode: React.ReactNode;
  if (content) {
    descriptionNode = <div {...descriptionProps}>{content}</div>;
  }

  return (
    <div {...contentProps}>
      {headerNode}
      <div {...bodyProps}>
        {descriptionNode}
        {footerNode}
      </div>
    </div>
  );
};

export default Content;
