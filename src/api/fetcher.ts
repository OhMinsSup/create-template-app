// api
import { api } from './module';

// types
import type { Options } from 'global-types/app-api';

export const fetcher = async <R = any, E = any>(
  url: string,
  options?: Options,
) => {
  const params = {
    url,
    options,
  };
  const response = await api.get<R, E>(params);
  return response;
};

export const fetcherData = async <R = any, E = any>(
  url: string,
  options?: Options,
) => {
  const params = {
    url,
    options,
  };
  const response = await api.get<R, E>(params);
  return response.data;
};
