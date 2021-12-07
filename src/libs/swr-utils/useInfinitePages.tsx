import { useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import result from 'lodash-es/result';
import flattenDeep from 'lodash-es/flattenDeep';
import last from 'lodash-es/last';
import head from 'lodash-es/head';

import { makeQueryString } from '@utils/utils';
import { fetcherData } from '@api/fetcher';

// types
import type { SWRInfiniteConfiguration } from 'swr/infinite';

type Options = {
  path?: string;
  enable?: boolean | null;
  serialize?: (data: any, path: string, filter?: typeof result) => any; // fetcher 함수의 결과를 받아서 처리할 함수
};

type DataParams<P> = Partial<P & { pageSize?: number }>;

type ConfigOptions = Partial<SWRInfiniteConfiguration & Options>;

export function useInfinitePages<Item = any, Params = any>(
  url: string,
  params: DataParams<Params> = {},
  options: ConfigOptions = {},
) {
  const {
    path = 'list',
    enable = true,
    revalidateAll = true,
    serialize = (data: any, path: string) => {
      return result<any[]>(data, path, []);
    },
  } = options;

  const { pageSize = 10 } = params;

  const config: SWRInfiniteConfiguration = {
    ...(revalidateAll ? { revalidateAll } : {}),
  };

  const swrKeyLoader = (pageIndex: number) => {
    if (!enable) return null;
    const cursor = pageIndex === 0 ? 1 : pageIndex + 1;
    return [url, makeQueryString(params), cursor];
  };

  const wrappedFetcher = async (url: string, q: string, pageNo: number) => {
    const pathQuery = q
      ? `${url}${q}&pageNo=${pageNo}`
      : `${url}${q}?pageNo=${pageNo}`;
    const data = await fetcherData(pathQuery);
    return serialize(data, path, result);
  };

  const response = useSWRInfinite<Item[], any>(
    swrKeyLoader,
    wrappedFetcher,
    config,
  );

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
  const isEmptyData = data?.[0]?.length === 0;

  // 마지막 페이지인지 여부
  const isReachingEnd =
    isEmptyData || (data && data[data.length - 1]?.length < pageSize);

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
    list: {
      data,
      error,
      results,
      size,
      lastPage,
      firstPage,
    },
    action: {
      onIntersection: () => setSize(size + 1),
      mutate,
      setSize,
    },
  };

  return returnValues;
}
