import { useCallback, useState } from 'react';
import { useSWRConfig } from 'swr';

// utils
import { isFunction, isString, isPromise } from '@utils/assertion';

// error
import { ApiError } from '@libs/error';

import type { AxiosResponse } from 'axios';
import type { AppAPI } from 'global-types/app-api';

type Fn = (...args: any[]) => Promise<AxiosResponse<AppAPI<any>>>;

interface Mutation<R> {
  ok: boolean;
  data: AppAPI<R> | null;
  message?: string;
}

interface Options<R = any> {
  invalidateKey?: string | ((data: AppAPI<R>) => string); // 요청이 성공하고 데이터를 invalidate를 할 때 사용
  deleteKey?: string; // 요청이 성공하고 데이터를 삭제할 때 사용
  onSuccess?: (data: AppAPI<R>) => any; // 요청이 성공 후 호출하는 함수
  onError?: (error: Mutation<R>) => any; // 요청 후 에러가 발생하면 호출하는 함수
}

/**
 * @example
 * const { mutateAync, loading, data } = useMutation(API_FUNC, {
 *   invalidateKey: (data) => 'API_END_POINT' || 'API_END_POINT', // 요청이 성공하고 데이터를 invalidate를 할 때 사용 함수로 값을 받을 경우 첫번째 파라미터에 성공한 데이터가 넘어오게 된다. (default: undefined)
 *   deleteKey: 'API_END_POINT', // 해당 키가 존재하면 요청 성공시 삭제한다. (default: undefined)
 *   onSuccess: (data) => {}, // 요청이 성공 후 호출하는 함수 그리고 첫번째 파라미터에 성공한 데이터가 넘어오게 된다. (default: undefined)
 *   onError: (error) => {}, // 요청 후 에러가 발생하면 호출하는 함수 그리고 첫번째 파라미터에 실패한 에러 객체가 넘어오게 된다. (default: undefined)
 * });
 *
 * mutateAync: API 요청
 * loading: API 요청 중 상태
 * data: API 요청 성공 시 반환 데이터 (해당 데이터는 요청 성공 시 state로 데이터를 받기 위해서 사용. 요청 실패 시 null)
 */
export function useMutation<T>(fn: Fn, options?: Options<T> | undefined) {
  const { cache, mutate } = useSWRConfig();

  const [data, setState] = useState<AppAPI<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Mutation<T> | null>(null);

  // 요청이 성공 후 deleteKey에 해당하는 데이터 삭제
  const onDeleteKey = useCallback(() => {
    if (options?.deleteKey && isString(options.deleteKey)) {
      if (cache.get(options.deleteKey)) cache.delete(options.deleteKey);
    }
  }, [cache, options?.deleteKey]);

  const onInvalidateKey = useCallback(
    async (data: AppAPI<T>) => {
      // 성공시 데이터 패칭
      if (options?.invalidateKey) {
        if (
          isString(options.invalidateKey) ||
          isFunction(options.invalidateKey)
        ) {
          const key = isFunction(options.invalidateKey)
            ? options.invalidateKey(data)
            : options.invalidateKey;
          await mutate(key);
        }
      }
    },
    [options, mutate],
  );

  const onSuccess = useCallback(
    async (data: AppAPI<T>) => {
      setState(data);
      // 성공시 콜백 호출
      if (isFunction(options?.onSuccess)) {
        if (isPromise(options?.onSuccess)) {
          await options?.onSuccess(data);
        } else {
          options?.onSuccess(data);
        }
      }
    },
    [options],
  );

  const onError = useCallback(
    async (e: Mutation<T>) => {
      setError(e);
      // 실패시 콜백 호출
      if (isFunction(options?.onError)) {
        if (isPromise(options?.onError)) {
          await options?.onError(e);
        } else {
          options?.onError(e);
        }
      }
    },
    [options],
  );

  const request = useCallback(
    async (...params) => {
      setState(null);
      setError(null);
      setLoading(true);
      const result = await fn(...params);
      setLoading(false);
      return result;
    },
    [fn],
  );

  const mutateAsync = useCallback(
    async (...params: any[]): Promise<Mutation<T>> => {
      try {
        const result = await request(...params);
        const { status, data } = result;
        if (status >= 200 && status < 300) {
          // 성공 시 캐시키 삭제
          onDeleteKey();

          // 성공시 데이터 패칭
          onInvalidateKey(data);

          // 성공시 콜백 호출
          onSuccess(data);

          return {
            ok: true,
            data,
            message: '',
          };
        }

        throw new ApiError(data);
      } catch (e) {
        setLoading(false);
        setState(null);

        const message: Mutation<T> = {
          ok: false,
          data: null,
          message: '',
        };

        // http status가 실패인 경우 서버 에러
        if (ApiError.isAxiosError(e)) {
          Object.assign(message, {
            data: e.response?.data,
            message: e.response?.statusText,
          });
          onError(message);
          return message;
        }

        // http status는 성공이지만 api status가 실패인 경우
        if (ApiError.isApiError(e)) {
          const data = ApiError.toApiErrorJSON(e.message);
          Object.assign(message, {
            data: data.message,
            message: e.message,
          });
          onError(message);
          return message;
        }

        onError(message);
        return message;
      }
    },
    [request, onDeleteKey, onInvalidateKey, onSuccess, onError],
  );

  return {
    loading,
    data,
    error,
    mutateAsync,
    setError,
    setLoading,
    setState,
  };
}
