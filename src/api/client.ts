import axios from 'axios';
import { API_HOST } from '@contants/env';
import {
  createRequestLogInterceptor,
  createResponseLogInterceptor,
} from './middleware/createLogInterceptor';
import { createErrorLogInterceptor } from './middleware/createErrorLogInterceptor';

export const debug = true;

export const client = axios.create({
  baseURL: API_HOST,
});

// 요청이 발생하기 전에 작동합니다.
client.interceptors.request.use(createRequestLogInterceptor);

client.interceptors.response.use(
  createResponseLogInterceptor,
  createErrorLogInterceptor,
);

// refresh token 이 필요한 경우 사용합니다.
// createAuthRefreshInterceptor(client);
