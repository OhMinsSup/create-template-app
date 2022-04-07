import axios, { AxiosRequestConfig } from 'axios';
import omit from 'lodash-es/omit';

// clinet
import { client } from './client';
import { STORAGE_KEY } from '@contants/constant';
import i18n from '@locales/i18n';
import { isBrowser } from '@utils/utils';

// types
import type { Options, Params, AppAPI } from 'global-types/app-api';

class APIMoudle {
  authorized(options?: Partial<Options>) {
    const authorization = localStorage.getItem(STORAGE_KEY.TOKEN_KEY);
    if (!authorization) return null;
    return authorization;
  }

  baseConfig = (
    config: AxiosRequestConfig | undefined,
    options: Partial<Options>,
  ) => {
    const authorization = this.authorized(options);
    const language = !isBrowser ? null : i18n.language;
    return {
      ...(config && omit(config, ['headers'])),
      headers: {
        'Content-Type': 'application/json',
        ...(language && {
          'Accept-Language': language,
        }),
        ...(authorization && {
          Authorization: `Bearer ${authorization}`,
        }),
        ...(config && config.headers),
      },
    };
  };

  delete<D = any, E = any>({
    url,
    config = undefined,
    options = { context: null, fallbackData: null },
  }: Params) {
    return client.delete<AppAPI<D, E>>(url, this.baseConfig(config, options));
  }

  post<D = any, E = any>({
    url,
    body,
    config = undefined,
    options = { context: null, fallbackData: null },
  }: Params) {
    return client.post<AppAPI<D, E>>(
      url,
      body,
      this.baseConfig(config, options),
    );
  }

  put<D = any, E = any>({
    url,
    body = {},
    config = undefined,
    options = { context: null, fallbackData: null },
  }: Params) {
    return client.put<AppAPI<D, E>>(
      url,
      body,
      this.baseConfig(config, options),
    );
  }

  get<D = any, E = any>({
    url,
    config = undefined,
    options = { context: null, fallbackData: null },
  }: Params) {
    return client.get<AppAPI<D, E>>(url, this.baseConfig(config, options));
  }

  getMockResponse = <Item = any>(url: string) => {
    return axios.get<Item>(url, {
      baseURL: 'https://60c1a3544f7e880017dbff1f.mockapi.io/',
    });
  };
}

export const api = new APIMoudle();
