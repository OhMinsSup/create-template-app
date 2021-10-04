import React from 'react';
import { css } from '@emotion/react';

import AppLayout from '@components/example/AppLayout';

const IndexPage = () => {
  return (
    <div css={rootStyles}>
      <div css={mainStyles}>
        <h1 css={titleStyles}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p css={descriptionStyles}>
          Get started by editing <code css={codeStyles}>pages/index.js</code>
        </p>

        <div css={gridStyles}>
          <a href="https://nextjs.org/docs" css={cardStyles}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" css={cardStyles}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            css={cardStyles}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            css={cardStyles}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

IndexPage.Layout = AppLayout;

const rootStyles = css`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const mainStyles = css`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const cardStyles = css`
  margin: 1rem;
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
  width: 45%;
  &:hover,
  &:focus,
  &:active {
    color: #0070f3;
    border-color: #0070f3;
  }
  & > h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }
  & > p {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.5;
  }
`;

const descriptionStyles = css`
  line-height: 1.5;
  text-align: center;
  font-size: 1.5rem;
`;

const codeStyles = css`
  background: var(--primary);
  border-radius: 5px;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
    Bitstream Vera Sans Mono, Courier New, monospace;
`;

const gridStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 800px;
  margin-top: 3rem;
`;

const titleStyles = css`
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
  text-align: center;
  &:hover,
  &:focus,
  &:active {
    text-decoration: underline;
  }
  & > a {
    color: #0070f3;
    text-decoration: none;
  }
`;
