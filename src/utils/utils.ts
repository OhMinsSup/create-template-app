import multiavatar from '@multiavatar/multiavatar/esm';
import qs from 'qs';
import { STORAGE_KEY } from '@contants/constant';
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

export function isAxiosError<R = any>(
  error: AxiosError | any,
): error is AxiosError<R> {
  return error && axios.isAxiosError(error);
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateKey = () => {
  return Math.random().toString(36).substr(2, 11);
};

export const generateAvatar = (avatarKey: string) => {
  return multiavatar(avatarKey);
};

export const getToken = () => {
  if (typeof window === 'undefined') return '';
  const token = localStorage.getItem(STORAGE_KEY.TOKEN_KEY);
  if (!token) return '';
  return token;
};

export const getUserInfo = () => {
  if (typeof window === 'undefined') return null;
  const token = getToken();
  if (!token) return null;

  try {
    const stringify = localStorage.getItem(STORAGE_KEY.USER_KEY);
    if (!stringify) return null;

    const userInfo = JSON.parse(stringify);
    if (!userInfo) return null;

    return userInfo;
  } catch (error) {
    return null;
  }
};

export const getUserThumbnail = ({
  defaultProfile,
  avatarSvg,
  profileUrl,
  name = 'null',
}: {
  defaultProfile: boolean;
  avatarSvg?: string | null;
  profileUrl?: string | null;
  name?: string;
}) => {
  const svgCode = `data:image/svg+xml;utf8,${encodeURIComponent(
    generateAvatar(avatarSvg ?? name),
  )}`;
  return defaultProfile ? svgCode : profileUrl ?? svgCode;
};

export function canUseDOM(): boolean {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

export const isBrowser = canUseDOM();
