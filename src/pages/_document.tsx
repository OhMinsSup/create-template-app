import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import i18n from '@locales/i18n';

class MyDocument extends Document {
  render() {
    return (
      <Html lang={i18n.language} dir="ltr">
        <Head>
          <meta charSet="utf-8" />
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
        </body>
      </Html>
    );
  }
}

export default MyDocument;
