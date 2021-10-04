import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { GOOGLE_ANALYTICS_G_TAG } from '@contants/env';
import i18n from '@locales/i18n';

class MyDocument extends Document {
  // Function will be called below to inject
  // script contents onto page
  setGoogleTags() {
    return {
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){
          window.dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', '${GOOGLE_ANALYTICS_G_TAG}', { 'send_page_view': false });
      `,
    };
  }
  render() {
    return (
      <Html lang={i18n.language} dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          {/* <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, viewport-fit=cover"
          /> */}
          {GOOGLE_ANALYTICS_G_TAG && (
            <script
              async={true}
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_G_TAG}`}
            />
          )}
          <script async src="https://apis.google.com/js/api:client.js" />
          <script async type="text/javascript" src="/js/kakao-sdk.js" />
          <script
            async
            type="text/javascript"
            src="https://code.jquery.com/jquery-1.12.4.min.js"
          ></script>
          <script
            async
            type="text/javascript"
            src="https://cdn.iamport.kr/js/iamport.payment-1.1.8.js"
          ></script>
          <link
            rel="stylesheet"
            href="https://pro.fontawesome.com/releases/v5.15.4/css/all.css"
            integrity="sha384-rqn26AG5Pj86AF4SO72RK5fyefcQ/x32DNQfChxWvbXIyXFePlEktwD18fEz+kQU"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          {GOOGLE_ANALYTICS_G_TAG && (
            <script dangerouslySetInnerHTML={this.setGoogleTags()} />
          )}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
