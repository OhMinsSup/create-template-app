import React from 'react';
import Head from 'next/head';
import { SITE_URL } from '@contants/env';

const SEO: React.FC = () => {
  return (
    <Head>
      <title>web-boilerplate</title>
      <link rel="canonical" href={SITE_URL} />
      <meta name="description" content="쉽고 빠른 템플릿" />
      <meta property="og:image" content="/images/card.png" />
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href="/favicon/favicon.ico"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/favicon/apple-touch-icon.png"
      />
      <link rel="icon" sizes="16x16" href="/favicon/icon-16x16.png" />
      <link rel="icon" sizes="32x32" href="/favicon/icon-32x32.png" />
      <meta property="og:title" content="web-boilerplate" />
      <meta property="og:description" content="쉽고 빠른 템플릿" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:image" content="/images/card.png" />
      <meta property="og:site_name" content="web-boilerplate" />
      <meta property="twitter:title" content="web-boilerplate" />
      <meta property="twitter:description" content="쉽고 빠른 템플릿" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="/images/card.png" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
    </Head>
  );
};

export default SEO;
