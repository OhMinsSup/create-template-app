// contants
import { SITE_URL } from '@contants/env';

// api
import { api } from './module';

// types
import type { Options } from 'type/app-api';

export const fetcher = async <R = any, E = any>(
  url: string,
  options?: Options,
) => {
  const params = {
    url,
    options,
  };
  const response = await api.getResponse<R, E>(params);
  return response;
};

export const fetcherMock = async (url: string) => {
  const response = await api.getMockResponse(url);
  return response;
};
