import 'antd/dist/antd.css';
import '@assets/scss/main.scss';

import 'moment/locale/ko';

import React from 'react';

import Provider from '@provider/provider';
import { Scripts } from '@components/ui/Scripts';
import { Core } from '@components/ui/Core';

// sentry
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

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

const Noop: React.FC = ({ children, ...resetProps }) => {
  const components = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, resetProps);
    }
    return child;
  });

  return <>{components}</>;
};

function AppPage({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop;

  console.log('pageProps', pageProps);

  return (
    <>
      <Scripts />
      <Provider>
        <Core>
          <Layout pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>
        </Core>
      </Provider>
    </>
  );
}

export default AppPage;
