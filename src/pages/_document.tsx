import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import i18n from '@locales/i18n';

class MyDocument extends Document {
  render() {
    return (
      <Html lang={i18n.language} dir="ltr">
        <Head>
          <meta charSet="utf-8" />
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
