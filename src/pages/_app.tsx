import 'antd/dist/antd.css';
import '@assets/scss/main.scss';

import 'moment/locale/ko';

import React from 'react';
import moment from 'moment';

import AppProvider from '@provider/AppProvider';
import { SEO } from '@components/common/SEO';

// sentry
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

import i18n from '@locales/i18n';
import { LANG_TYPE } from '@contants/constant';
import { SENTRY_DSN, IS_PROD, IS_DEPLOY_GROUP_PROD } from '@contants/env';

// types
import type { AppProps } from 'next/app';

Sentry.init({
  enabled: [SENTRY_DSN, IS_PROD, IS_DEPLOY_GROUP_PROD].every(Boolean),
  dsn: SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const Noop: React.FC = ({ children }) => <>{children}</>;

function AppPage({ Component, pageProps }: AppProps) {
  const lang = i18n.language || LANG_TYPE.KO;

  moment.locale(lang);

  const Layout = (Component as any).Layout || Noop;

  return (
    <>
      <SEO />
      <AppProvider>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </AppProvider>
    </>
  );
}

export default AppPage;
