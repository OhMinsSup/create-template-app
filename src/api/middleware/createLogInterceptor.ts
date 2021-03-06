import { debug } from '@api/client';
import { IS_PROD } from '@contants/env';

// types
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export const createResponseLogInterceptor = (response: AxiosResponse) => {
  if (!IS_PROD && debug) {
    console.log(
      `%cπ« API μλ΅ μμ  μ£Όμ:${
        response.config.url
      } μ ν:${response.config.method?.toUpperCase()} \nAPIμνμ½λ:0`,
      'color: #69db7c;',
      response,
    );
  }

  return response;
};

export const createRequestLogInterceptor = (config: AxiosRequestConfig) => {
  if (!IS_PROD && debug) {
    console.log(
      `%cπ¦ API μμ²­ μ‘μ   μ£Όμ:${
        config.url
      } μ ν:${config.method?.toUpperCase()}`,
      'color: #E19A56;',
      config.params,
    );
  }

  return config;
};
