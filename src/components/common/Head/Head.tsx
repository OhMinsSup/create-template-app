import React from 'react';
import Script from 'next/script';
import { GOOGLE_ANALYTICS_G_TAG } from '@contants/env';

interface HeadProps {}
const Head: React.FC<HeadProps> = () => {
  const renderGoogleAnalytics = () => {
    if (!GOOGLE_ANALYTICS_G_TAG) return null;
    return (
      <>
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_G_TAG}`}
        />
        <Script strategy="lazyOnload" id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){
              window.dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_G_TAG}', { 'send_page_view': false });
          `}
        </Script>
      </>
    );
  };

  const renderClientLibs = () => {
    return <></>;
  };

  return (
    <>
      {renderGoogleAnalytics()}
      {renderClientLibs()}
    </>
  );
};

export default Head;
