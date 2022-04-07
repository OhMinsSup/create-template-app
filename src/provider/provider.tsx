import React from 'react';

// swr
import { SWRConfig } from 'swr';
import { logger } from '@libs/swr-utils';

// i18n
import { I18nextProvider } from 'react-i18next';
import i18n from '@locales/i18n';

// context
import { AuthProvider } from './contexts';

// constant
import { STATUS_CODE } from '@contants/constant';

const AppProvider: React.FC = ({ children }) => {
  return (
    <SWRConfig
      value={{
        errorRetryCount: 3,
        use: [logger],
        revalidateOnFocus: false, // UPDATE: 화면 포커스시 자동으로 재요청하는 로직 (API 요청 줄이기)
        onErrorRetry,
        onError: (error: any) => {
          console.error(error);
        },
      }}
    >
      <I18nextProvider i18n={i18n}>
        <AuthProvider>{children}</AuthProvider>
      </I18nextProvider>
    </SWRConfig>
  );
};

export default AppProvider;

const onErrorRetry = async (
  error: any,
  key: any,
  config: any,
  revalidate: any,
  { retryCount }: any,
) => {
  const STATUS = [
    STATUS_CODE.BAD_GATEWAY,
    STATUS_CODE.SERVER_ERROR,
    STATUS_CODE.NOT_FOUND,
  ];

  if (STATUS.includes(error.status)) {
    return;
  }

  // Only retry up to 5 times.
  if (retryCount && retryCount >= 3) return;

  // Never retry on Timeout error
  if (error.code === 'ECONNABORTED') {
    return;
  }

  setTimeout(() => revalidate({ retryCount }), 5000);
};
