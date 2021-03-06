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
        `%cπ« HTTP Error μλ΅ μμ  μ£Όμ:${
          response.config.url
        } μ ν:${response.config.method?.toUpperCase()} \nμνμ½λ:${
          response.status
        }`,
        'color: #e03131;',
        response,
      );
    }
  }

  return Promise.reject(error);
};
