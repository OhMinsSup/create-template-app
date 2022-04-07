import { debug } from '@api/client';
import { isFunction } from '@utils/assertion';
import { useRef, useEffect, useCallback } from 'react';
import type { Middleware } from 'swr';

export const laggy: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const laggyDataRef = useRef<any>();

    const swr = useSWRNext(key, fetcher, config);

    useEffect(() => {
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data;
      }
    }, [swr.data]);

    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined;
    }, []);

    const dataOrLaggyData =
      swr.data === undefined ? laggyDataRef.current : swr.data;

    const isLagging =
      swr.data === undefined && laggyDataRef.current !== undefined;

    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    });
  };
};

export const logger: Middleware = (useSWRNext) => {
  return (key, fetcher: any, config) => {
    // Add logger to the original fetcher.
    const extendedFetcher = (...args: any) => {
      if (debug) {
        console.log(
          `%c🔥 SWR Request:${isFunction(key) ? key() : key}`,
          'color: #ffd43b;',
        );
      }
      return fetcher(...args);
    };

    // Execute the hook with the new fetcher.
    return useSWRNext(key, extendedFetcher, config);
  };
};
