import { useCallback, useMemo } from 'react';
import qs from 'qs';
import useSWRInfinite from 'swr/infinite';
import result from 'lodash-es/result';
import flattenDeep from 'lodash-es/flattenDeep';
import last from 'lodash-es/last';
import head from 'lodash-es/head';

// hooks
import { useAuthContext } from '@provider/contexts';

import {
  isEmpty,
  isFunction,
  isNumber,
  isObject,
  isString,
} from '@utils/assertion';
import { fetcherData } from '@api/fetcher';
import {
  validatingQueryString,
  baseGuardConfig,
  baseQueryParserConfig,
  baseStringifyConfig,
} from '@libs/swr-utils/useQuery';

// types
import type { SWRInfiniteConfiguration } from 'swr/infinite';
import type { IStringifyOptions } from 'qs';
import type {
  GuardOptions,
  QueryParserOptions,
} from '@libs/swr-utils/useQuery';

interface SelectorOptions {
  pathKey: string;
  cursorKey: string;
  cursor: string;
  sizeKey: string;
}

export interface InfiniteListOptions extends SWRInfiniteConfiguration {
  guard?: Partial<GuardOptions>;
  queryParserOptions?: QueryParserOptions;
  stringifyOptions?: IStringifyOptions;
  selectorOptions?: Partial<SelectorOptions>;
  onFetch?: (...args: any[]) => void;
}

const hasPrefix = (url: string) => url.indexOf('?') > -1;
const serialize = (data: any, path: string) => result<any[]>(data, path, []);
const getId = (
  record: Record<string, any>,
  {
    defaultValues,
    cursor,
  }: {
    cursor?: string;
    defaultValues?: any;
  },
) => {
  if (!cursor) return defaultValues;
  const id = record[cursor];
  if (!id) return defaultValues;
  return id;
};
const getLimitSize = (options: QueryParserOptions, selector: string) => {
  const defaultSize = 10;
  const obj = options.qs || null;
  if (isEmpty(obj)) return defaultSize;

  let size: string | number = defaultSize;
  if (isString(obj)) {
    const qsObj = qs.parse(obj);
    size = qsObj[selector]?.toString() || defaultSize;
  }

  if (isObject(obj)) {
    size = obj[selector] || defaultSize;
  }

  if (isNumber(size)) return size;

  return parseInt(size, 10);
};

export function useInfiniteList<Item = any>(
  key: string | (() => string | null) | null,
  options?: InfiniteListOptions,
) {
  const { userInfo } = useAuthContext();
  const {
    stringifyOptions,
    queryParserOptions,
    selectorOptions,
    guard,
    fetcher,
    onFetch = undefined,
    ...option
  } = options || {};

  const fetcherResult = fetcher || fetcherData;

  const mergedStringifyOptions = useMemo(
    () => ({
      ...baseStringifyConfig,
      ...stringifyOptions,
    }),
    [stringifyOptions],
  );

  const mergedQueryParserOptions = useMemo(
    () => ({
      ...baseQueryParserConfig,
      ...queryParserOptions,
    }),
    [queryParserOptions],
  );

  const mergedGuardConfig = {
    ...baseGuardConfig,
    ...guard,
  };

  const selectorConfig = useMemo(
    () => ({
      pathKey: selectorOptions?.pathKey || 'data',
      cursor: selectorOptions?.cursor || undefined,
      cursorKey: selectorOptions?.cursorKey || 'pageNo',
      sizeKey: selectorOptions?.sizeKey || 'pageSize',
    }),
    [selectorOptions],
  );

  const limit = useMemo(
    () => getLimitSize(mergedQueryParserOptions, selectorConfig.sizeKey),
    [mergedQueryParserOptions, selectorConfig],
  );

  const swrKeyLoader = useCallback(
    (nextPageNo: number, previousPage: any) => {
      const url: string | null = isFunction(key) ? key() : key;
      if (!url) return null;

      // 로그인 체크를 할지 여부
      if (mergedGuardConfig.checkLogin && !userInfo) {
        // 로그인을 안한 경우
        return null;
      }

      let fullUrl = validatingQueryString({
        fullUrl: url,
        parserOptions: mergedQueryParserOptions,
        stirngifyOptions: mergedStringifyOptions,
      });

      if (!fullUrl) return null;

      if (!previousPage) {
        return fullUrl;
      }

      const lastItem: Record<string, any> | undefined = last(previousPage);
      if (!lastItem) return null;
      const next = getId(lastItem, {
        defaultValues: nextPageNo,
        cursor: selectorConfig.cursor,
      });
      if (next && hasPrefix(fullUrl)) {
        fullUrl += `&${selectorConfig.cursorKey}=${next}`;
      } else if (next && !hasPrefix(fullUrl)) {
        fullUrl += `?${selectorConfig.cursorKey}=${next}`;
      }
      return fullUrl;
    },
    [
      key,
      mergedGuardConfig.checkLogin,
      mergedQueryParserOptions,
      mergedStringifyOptions,
      userInfo,
      selectorConfig,
    ],
  );

  const wrappedFetcher = useCallback(
    async (url: string) => {
      const data = await fetcherResult(url);
      if (onFetch && isFunction(onFetch)) onFetch(data);
      return serialize(data, selectorConfig.pathKey);
    },
    [fetcherResult, selectorConfig, onFetch],
  );

  const response = useSWRInfinite<Item[]>(swrKeyLoader, wrappedFetcher, option);

  const { data, error, size, mutate, setSize, isValidating } = response;

  const results: Item[] = useMemo(() => {
    if (!data) return [];
    const list = data ?? [];
    return flattenDeep(list.map((item) => item));
  }, [data]);

  const firstPage = head(data);
  const lastPage = last(data);

  // 초기 데이터 로딩 중인지 여부
  const isLoadingInitialData = !data && !error;

  // 더보기 로딩 중인지 여부
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  // 데이터가 없는 경우
  const isEmptyData = isEmpty(firstPage);

  // 마지막 페이지인지 여부
  const isReachingEnd =
    isEmptyData || (data && data[data.length - 1]?.length < limit);

  // 새로고침 중인지 여부
  const isRefreshing = isValidating && data && data.length === size;

  const returnValues = {
    status: {
      isValidating,
      isLoadingInitialData,
      isLoadingMore,
      isEmptyData,
      isReachingEnd,
      isRefreshing,
    },
    record: {
      data,
      error,
      results,
      size,
      lastPage,
      firstPage,
    },
    action: {
      mutate,
      setSize,
    },
    injectProps: {
      error,
      isLoadingInitialData,
      isLoadingMore,
      isReachingEnd,
      isEmptyData,
      onIntersect: useCallback(() => {
        setSize?.(size + 1);
      }, [setSize, size]),
    },
  };

  return returnValues;
}
