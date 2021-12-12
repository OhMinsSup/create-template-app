import React from 'react';

// swr
import { SWRConfig } from 'swr';

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
        onErrorRetry,
      }}
    >
      <I18nextProvider i18n={i18n}>
        <AuthProvider>{children}</AuthProvider>
      </I18nextProvider>
    </SWRConfig>
  );
};

export default AppProvider;

const onErrorRetry = async (error: any, key: any, { errorRetryCount }: any) => {
  // Only retry up to 5 times.
  if (errorRetryCount && errorRetryCount >= 5) return;

  // Never retry on 502 or 500. UNAUTHORIZED
  const STATUS = [
    STATUS_CODE.BAD_GATEWAY,
    STATUS_CODE.SERVER_ERROR,
    STATUS_CODE.UNAUTHORIZED,
  ];
  if (STATUS.includes(error.status)) {
    return;
  }

  // Never retry on Timeout error
  if (error.code === 'ECONNABORTED') {
    return;
  }
};
