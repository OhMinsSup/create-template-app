import axios from 'axios';

// clinet
import { client } from './client';
import { STORAGE_KEY } from '@contants/constant';
import i18n from '@locales/i18n';

// types
import type { Options, Params, AppAPI } from 'type/app-api';

class APIMoudle {
  authorized(options?: Partial<Options>) {
    const authorization = localStorage.getItem(STORAGE_KEY.TOKEN_KEY);
    if (!authorization) return null;
    return authorization;
  }

  async deleteResponse<D = any, E = any>({
    url,
    headers = {},
    options = { context: null, fallbackData: null },
  }: Params) {
    const authorization = this.authorized(options);
    const language = typeof window === 'undefined' ? null : i18n.language;
    const result = await client.delete<AppAPI<D, E>>(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(language && {
          'Accept-Language': language,
        }),
        ...(authorization && {
          Authorization: authorization,
        }),
        ...headers,
      },
    });
    return result;
  }

  async postResponse<D = any, E = any>({
    url,
    body = {},
    headers = {},
    options = { context: null, fallbackData: null },
  }: Params) {
    const authorization = this.authorized(options);
    const language = typeof window === 'undefined' ? null : i18n.language;
    const result = await client.post<AppAPI<D, E>>(url, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(language && {
          'Accept-Language': language,
        }),
        ...(authorization && {
          Authorization: authorization,
        }),
        ...headers,
      },
    });
    return result;
  }

  async putResponse<D = any, E = any>({
    url,
    body = {},
    headers = {},
    options = { context: null, fallbackData: null },
  }: Params) {
    const authorization = this.authorized(options);
    const language = typeof window === 'undefined' ? null : i18n.language;
    const result = await client.put<AppAPI<D, E>>(url, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(language && {
          'Accept-Language': language,
        }),
        ...(authorization && {
          Authorization: authorization,
        }),
        ...headers,
      },
    });
    return result;
  }

  async getResponse<D = any, E = any>({
    url,
    headers = {},
    options = { context: null, fallbackData: null },
  }: Params) {
    const isServer = typeof window === 'undefined';
    const authorization = isServer ? null : this.authorized(options);
    const language = isServer ? null : i18n.language;
    const result = await client.get<AppAPI<D, E>>(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(language && {
          'Accept-Language': language,
        }),
        ...(authorization && {
          Authorization: authorization,
        }),
        ...headers,
      },
    });
    return result;
  }

  getMockResponse = <Item = any>(url: string) => {
    return axios.get<Item>(url, {
      baseURL: 'https://60c1a3544f7e880017dbff1f.mockapi.io/',
    });
  };
}

export const api = new APIMoudle();
