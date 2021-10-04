import multiavatar from '@multiavatar/multiavatar/esm';
import qs from 'qs';
import { STORAGE_KEY } from '@contants/constant';

export const makeQueryString = (params: any) => {
  const stringify = qs.stringify(params, {
    arrayFormat: 'comma',
    skipNulls: true,
    addQueryPrefix: true,
  });
  return stringify;
};

export const getUniqueFilter = (
  iters: { [key: string]: any }[],
  key: string,
) => {
  return Array.from(
    iters.reduce((map, obj) => map.set(obj[key], obj), new Map()).values(),
  );
};

export const fn = (args: any) => args;

export function isAxiosError(error: any) {
  return !!error.data || !!error.response;
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateAvatarKey = () => {
  const avatarKey = Math.random().toString(36).substr(2, 11);
  return avatarKey;
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
