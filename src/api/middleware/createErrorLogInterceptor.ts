import { debug } from '@api/client';
import * as Sentry from '@sentry/browser';

// types
import type { AxiosError } from 'axios';

export const createErrorLogInterceptor = (error: AxiosError) => {
  if (error.response) {
    const { response } = error;
    if (response.status >= 500) {
      Sentry.captureException(error);
    }

    if (debug) {
      console.log(
        `%c🚫 HTTP Error 응답 수신 주소:${
          response.config.url
        } 유형:${response.config.method?.toUpperCase()} \n상태코드:${
          response.status
        }`,
        'color: #e03131;',
        response,
      );
    }
  }

  return Promise.reject(error);
};
