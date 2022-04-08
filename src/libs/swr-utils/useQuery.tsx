import useSWR from 'swr';
import { stringify } from 'qs';
import { useAuthContext } from '@provider/contexts';

// api
import { fetcherData } from '@api/fetcher';

// utils
import { isEmpty, isFunction, isObject, isString } from '@utils/assertion';

import type { SWRConfiguration } from 'swr';
import type { IStringifyOptions } from 'qs';

export const baseStringifyConfig: IStringifyOptions = {
  skipNulls: true,
  addQueryPrefix: true,
  arrayFormat: 'indices',
};

export interface QueryParserOptions {
  qs?: Record<string, any> | string;
}

export const baseQueryParserConfig: QueryParserOptions = {};

export interface GuardOptions {
  checkLogin: boolean; // 로그인 여부 체크
}

export const baseGuardConfig: GuardOptions = {
  checkLogin: false,
};

export interface Options extends SWRConfiguration {
  guard?: Partial<GuardOptions>;
  queryParserOptions?: QueryParserOptions;
  stringifyOptions?: IStringifyOptions;
}

export const validatingQueryString = ({
  fullUrl,
  parserOptions,
  stirngifyOptions,
}: {
  fullUrl: string;
  parserOptions: QueryParserOptions;
  stirngifyOptions: IStringifyOptions;
}) => {
  // check url 객체안에 query 값이 있는지 확인
  if (fullUrl.includes('?')) {
    // query 값이 있는 경우 const query = url.search.slice(1);
    // query 값을 가지고 있는 url 객체를 반환
    return fullUrl;
  }

  const { qs } = parserOptions;
  // query string 값이 없으면 url을 그래도 리턴
  if (isEmpty(qs)) return fullUrl;

  // 존재하면 qs값이 string인지 객체인제 체크한다.
  if (isString(qs)) {
    // qs를 가지고 있는지 체크
    const hasPrefix = qs.startsWith('?');
    // qs값이 string인 경우
    // qs값을 가지고 있는 url 객체를 반환
    return `${fullUrl}${hasPrefix ? qs : `?${qs}`}`;
  } else if (isObject(qs)) {
    const qsString = stringify(qs, stirngifyOptions);
    const hasPrefix = qsString.startsWith('?');
    // qs값이 object인 경우
    // qs값을 가지고 있는 url 객체를 반환
    return `${fullUrl}${hasPrefix ? qsString : `?${qsString}`}`;
  }

  return fullUrl;
};

/**
 * @example
 * const { data } = useQuery("API_KEY", {
 *   queryParserOptions: {
 *     qs: router.query, // 요청시 라우터 쿼리 같이 넘기는 옵션 qs값이 없으면 쿼리 스트링이 없는 것으로 간주한다. 그리고 qs는 string 값도 허용합니다
 *     ex) qs: ?a=12&b=34 || a=12&b=34 || router.query || { a: 123, b: 456 } 이런식으로 값을 넘겨주시면 됩니다.
 *   },
 *   guard: {
 *     checkLogin: false, //checkLogin이 false인 경우 로그인이 필요없는 API 요청을 의미합니다. (default: false)
 *   },
 *  stringifyOptions: {
 *   // ...해당 내용은 qs 라이브러리 옵션 참고 - https://www.npmjs.com/package/qs
 *  }
 *  // ...나머지 옵션은 swr 라이브러리 옵션 참고 - https://swr.vercel.app/docs/options
 * });
 *
 */
export function useQuery<Data = any, Error = any>(
  key: string | (() => string | null) | null,
  options?: Options,
) {
  const { stringifyOptions, queryParserOptions, guard, fetcher, ...option } =
    options || {};
  const fetcherResult = fetcher || fetcherData;

  const { isLoggedIn } = useAuthContext();

  const mergedStringifyOptions = {
    ...baseStringifyConfig,
    ...stringifyOptions,
  };

  const mergedQueryParserOptions = {
    ...baseQueryParserConfig,
    ...queryParserOptions,
  };

  const mergedGuardConfig = {
    ...baseGuardConfig,
    ...guard,
  };

  const swrKeyLoader = () => {
    const url: string | null = isFunction(key) ? key() : key;
    if (!url) return null;

    // 로그인 체크를 할지 여부
    if (mergedGuardConfig.checkLogin) {
      // 로그인을 안한 경우
      if (!isLoggedIn) return null;
    }

    return validatingQueryString({
      fullUrl: url,
      parserOptions: mergedQueryParserOptions,
      stirngifyOptions: mergedStringifyOptions,
    });
  };

  const result = useSWR<Data, Error>(swrKeyLoader, fetcherResult, {
    ...option,
  });

  return {
    ...result,
    currentKey: swrKeyLoader(),
  };
}
