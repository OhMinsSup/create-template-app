import qs from 'qs';
import axios, { AxiosError } from 'axios';

export const makeQueryString = (params: any) =>
  qs.stringify(params, {
    arrayFormat: 'comma',
    skipNulls: true,
    addQueryPrefix: true,
  });

export const getUniqueFilter = (iters: { [key: string]: any }[], key: string) =>
  Array.from(
    iters.reduce((map, obj) => map.set(obj[key], obj), new Map()).values(),
  );

export function isAxiosError<T = any, D = any>(
  error: AxiosError | any,
): error is AxiosError<T, D> {
  return error && axios.isAxiosError(error);
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateKey = () => {
  return Math.random().toString(36).substr(2, 11);
};

export function canUseDOM(): boolean {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

export const isBrowser = canUseDOM();
