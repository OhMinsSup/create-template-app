import axios from 'axios';

// clinet
import { client } from './client';
import { API_ENDPOINTS, STORAGE_KEY } from '@contants/constant';
import i18n from '@locales/i18n';

// types
import type { Options, Params, appAPI, UploadParams } from 'type/app-api';

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
    const result = await client.delete<appAPI<D, E>>(url, {
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
    const result = await client.post<appAPI<D, E>>(url, body, {
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
    const result = await client.put<appAPI<D, E>>(url, body, {
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
    const result = await client.get<appAPI<D, E>>(url, {
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

  uploadResponse = async ({
    file,
    storeType,
    resize = false,
    fileIdx = undefined,
  }: UploadParams) => {
    if (!file) {
      const error = new Error('File is required');
      error.message = 'file is required';
      throw error;
    }

    if (!storeType) {
      const error = new Error('Store type is required');
      error.message = 'storeType is required';
      throw error;
    }

    const isServer = typeof window === 'undefined';
    const authorization = isServer ? null : this.authorized();

    // 업로드 url 정보
    const temp = await client.get<appAPI>(
      API_ENDPOINTS.NPLANET.STORE.TEMP_URL,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(authorization && {
            Authorization: authorization,
          }),
        },
      },
    );

    const {
      data: { tempFileType, uploadUrl },
    } = temp.data;

    // s3 파일 업로드
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (e) => {
        console.log(Math.round((e.loaded / e.total) * 100));
      },
    });

    const body = {};

    // 최종 파일 업로드
    const finalize = await client.post<appAPI>(
      API_ENDPOINTS.NPLANET.STORE.ROOT,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(authorization && {
            Authorization: authorization,
          }),
        },
      },
    );

    const { data: nData } = finalize.data;
    return nData;
  };

  getMockResponse = <Item = any>(url: string) => {
    return axios.get<Item>(url, {
      baseURL: 'https://60c1a3544f7e880017dbff1f.mockapi.io/',
    });
  };
}

export const api = new APIMoudle();
