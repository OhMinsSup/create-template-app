import axios from 'axios';

// constants
import { STATUS_CODE, API_ENDPOINTS, STORAGE_KEY } from '@contants/constant';
import { API_HOST } from '@contants/env';

// utils
import { isFunction } from '@utils/assertion';

// types
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import type { AppAPI } from 'global-types/app-api';

const authClient = axios.create({
  baseURL: API_HOST,
});

export interface AxiosAuthRefreshOptions {
  statusCodes?: Array<number>; // http status과 일치할 경우 refresh token 발급
  shouldRefresh?(error: AxiosError): boolean; // status 코드가 아닌 이유로 refresh token 발급이 필요할 경우 (인터셉터를 실행할 여러 상태 코드를 지정 가능)
}

interface FailedQueue {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false; // isTokenRefreshing이 false인 경우에만 token refresh 요청
let failedQueue: FailedQueue[] = []; // 실패한 api 호출을 위한 큐

const processQueue = (error?: any | null, token?: string | null) => {
  failedQueue.forEach((queue) => {
    if (error) {
      queue.reject(error);
    } else {
      queue.resolve(token);
    }
  });

  failedQueue = [];
};

// 해당 함수의 조건에 걸리는 경우에만 refresh token을 발급하고 토큰을 리턴한다.
const shouldInterceptError = (
  error: AxiosError,
  options: AxiosAuthRefreshOptions,
) => {
  if (!error) {
    return false;
  }

  if (!error.response) {
    return false;
  }

  const { statusCodes = [], shouldRefresh = undefined } = options;

  if (isFunction(shouldRefresh)) {
    const conditionShouldRefresh = shouldRefresh(error);
    return conditionShouldRefresh;
  }

  const conditionStatusCode = statusCodes.includes(error.response.status);
  return conditionStatusCode;
};

// 토큰을 발급하는 함수
const refreshAuth = async () => {
  try {
    const { data } = await authClient.post<AppAPI<any>>(
      '',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem(
            STORAGE_KEY.REFRESH_KEY,
          )}`,
        },
      },
    );

    return data.data;
  } catch (error) {
    throw error;
  }
};

export const createAuthRefreshInterceptor = (
  instance: AxiosInstance,
  options: AxiosAuthRefreshOptions = {},
) => {
  const {
    statusCodes = [STATUS_CODE.UNAUTHORIZED],
    shouldRefresh = undefined,
  } = options || {};

  return instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
      if (!shouldInterceptError(error, { statusCodes, shouldRefresh })) {
        return Promise.reject(error);
      }

      // 이미 refresh token을 발급하고 있는 경우
      if (error.config._retry || error.config._queued) {
        return Promise.reject(error);
      }

      const originalRequest = error.config;

      // token이 재발급 되는 동안의 요청은 failedQueue에 저장
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) =>
            failedQueue.push({ resolve, reject }),
          );
          // isRefreshing이 true인 경우 _queued의 상태를 설정하고 값을 저장한다.
          originalRequest._queued = true;

          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }

          return instance(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰을 발급하고 해당 토큰을 저장한다.
        const tokens = await refreshAuth();
        if (!tokens) {
          return Promise.reject(error);
        }

        const { accessToken, refreshToken } = tokens;
        localStorage.setItem(STORAGE_KEY.TOKEN_KEY, accessToken);
        localStorage.setItem(STORAGE_KEY.REFRESH_KEY, refreshToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        // 재요청
        return Promise.resolve(instance(originalRequest));
      } catch (error) {
        processQueue(error, null);
        return Promise.reject(error);
      } finally {
        // 발급하면 해제
        isRefreshing = false;
      }
    },
  );
};
