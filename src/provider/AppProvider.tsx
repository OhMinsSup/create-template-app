import React from 'react';
import { SWRConfig } from 'swr';
import { STATUS_CODE } from '@contants/constant';
import { AuthContextProvider } from './contexts/AuthContext';
import { LayoutContextProvider } from './contexts/LayoutContext';
import { ModalContextProvider } from './contexts/ModalContext';

const AppProvider: React.FC = ({ children }) => {
  return (
    <SWRConfig
      value={{
        onErrorRetry: async (error, key, { errorRetryCount }) => {
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
        },
      }}
    >
      <AuthContextProvider>
        <LayoutContextProvider>
          <ModalContextProvider> {children}</ModalContextProvider>
        </LayoutContextProvider>
      </AuthContextProvider>
    </SWRConfig>
  );
};

export default AppProvider;
