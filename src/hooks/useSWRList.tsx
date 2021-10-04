import React, { useMemo } from 'react';
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite';
import omit from 'lodash-es/omit';
import qs from 'qs';

// no components
import { COMMON_CONTANTS } from '@contants/constant';

// api
import { fetcher } from '@api/fetcher';
import { Options } from 'type/app-api';

type Serializable = {
  serialize?: (data: any) => any; // fetcher 함수의 결과를 받아서 처리할 함수
  serializeItem?: (data: any) => any; // list 각 item 을 받아서 처리할 함수
};

const defaultOptions = {
  enable: true,
};

export function useSWRList<Params = any, Item = any>(
  url: string,
  params: Partial<Params & { pageSize?: number }> = {},
  options: Partial<
    Options & SWRInfiniteConfiguration & Serializable
  > = defaultOptions,
) {
  const stringify = qs.stringify(params, {
    arrayFormat: 'comma',
    skipNulls: true,
    addQueryPrefix: true,
  });

  const key = (page: number) =>
    options.enable ? [url, stringify, page + 1] : null;

  const fetcherFn = async (
    url: string,
    queryString: string,
    pageNo: number,
  ) => {
    queryString = queryString
      ? queryString + `&pageNo=${pageNo}`
      : `?pageNo=${pageNo}`;

    const data = await fetcher(url + queryString);
    if (options?.serialize) {
      return options.serialize(data);
    }

    return data?.data?.data ?? [];
  };

  const { data, error, size, mutate, setSize, isValidating } = useSWRInfinite<
    Item[]
  >(key, fetcherFn, {
    ...omit(options, ['context', 'enable', 'serializeItem', 'serialize']),
  });

  const list = data ?? [];

  const results = useMemo(
    () =>
      ([] as Item[]).concat(
        ...list.map((item) => options?.serializeItem?.(item) || item),
      ),
    [list],
  );

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
    isEmptyData ||
    (data &&
      data[data.length - 1]?.length <
        (params?.pageSize ?? COMMON_CONTANTS.PAGE_SIZE[10]));

  // 새로고침 중인지 여부
  const isRefreshing = isValidating && data && data.length === size;

  return {
    error,
    results,
    size,
    isLoadingInitialData,
    isLoadingMore,
    isEmptyData,
    isReachingEnd,
    isRefreshing,
    mutate,
    setSize,
  };
}
