import qs from 'qs';
import axios, { AxiosError } from 'axios';
import { isElement, isEmpty } from './assertion';

export const makeQueryString = (
  params: any,
  stringifyOptions?: qs.IStringifyOptions | undefined,
) => {
  const options: qs.IStringifyOptions = {
    arrayFormat: 'comma',
    skipNulls: true,
    addQueryPrefix: true,
  };

  if (!isEmpty(options)) {
    Object.assign(options, stringifyOptions);
  }

  return qs.stringify(params, options);
};

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

export function getOwnerWindow(node?: Element | null): typeof globalThis {
  return isElement(node)
    ? getOwnerDocument(node)?.defaultView ?? window
    : window;
}

export function getOwnerDocument(node?: Element | null): Document {
  return isElement(node) ? node?.ownerDocument ?? document : document;
}
