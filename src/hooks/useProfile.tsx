import { useEffect } from 'react';
import isEmpty from 'lodash-es/isEmpty';
import noop from 'lodash-es/noop';

// api
import { fetcherData } from '@api/fetcher';

// hooks
import useSWR, { useSWRConfig } from 'swr';
import { useAuthContext } from '@provider/contexts';

// utils
import { getToken } from '@utils/utils';

import type { Middleware, SWRConfiguration } from 'swr';

export interface UserInfo extends Record<string, any> {}

interface ProfileConfig
  extends Pick<SWRConfiguration, 'onError' | 'onSuccess'> {
  enable?: boolean;
}

const KEY = 'profile';

const middleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const extendedFetcher = (...args: any[]) => {
      const token = getToken();
      if (!token) {
        return Promise.resolve<any>(null);
      }
      return fetcher?.(...args);
    };

    return useSWRNext(key, extendedFetcher, config);
  };
};

export const useProfile = (config: ProfileConfig = {}) => {
  const { enable = true, onError = noop, onSuccess = noop } = config;

  const { userInfo, setUserInfo } = useAuthContext();

  const { cache } = useSWRConfig();

  const getKey = () => {
    if (!enable) return null;
    if (!isEmpty(userInfo)) return null;
    return KEY;
  };

  const wrappedFetcher = async (url: string) => {
    const res = await fetcherData(url);
    if (!res || !res.data) return null;
    return res.data;
  };

  const { data, mutate } = useSWR<UserInfo>(getKey, wrappedFetcher, {
    use: [middleware],
    revalidateOnFocus: false,
    onSuccess: (result) => {
      if (result) setUserInfo(result);
      if (onSuccess) onSuccess(result);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });

  const updateProfile = async (profile?: UserInfo | null) => {
    if (profile) {
      const revalidateProfile = await mutate(profile, false);
      const revalidateCache = revalidateProfile ?? null;
      // profile 정보가 존재하면 cache 데이터 업데이트
      setUserInfo?.(revalidateCache);
    } else {
      setUserInfo?.(null);
      // 새로운 정보 요청
      await mutate();
    }
  };

  const clearProfile = () => {
    if (cache.get(KEY)) cache.delete(KEY);
    setUserInfo(null);
  };

  useEffect(() => {
    if (!userInfo) updateProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return {
    profile: data ?? userInfo,
    updateProfile,
    clearProfile,
  };
};
