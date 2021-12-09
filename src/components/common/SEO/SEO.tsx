import React from 'react';
import Head from 'next/head';
import { SITE_URL } from '@contants/env';

interface SEOProps {
  title?: string;
  siteUrl?: string;
  description?: string;
  image?: string;
  ogType?: string;
  twitterCard?: string;
}
const SEO: React.FC<SEOProps> = ({
  title,
  siteUrl,
  image,
  description,
  ogType,
  twitterCard,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={siteUrl} />
      <meta name="description" content={description} />
      <meta property="og:image" content={image} />
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
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={title} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:image" content={image} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
    </Head>
  );
};

export default SEO;

SEO.defaultProps = {
  title: 'web-boilerplate',
  siteUrl: SITE_URL,
  description: '쉽고 빠른 템플릿',
  image: '/images/card.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};
