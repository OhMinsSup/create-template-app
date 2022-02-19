import { useState, useCallback, useMemo, useRef } from 'react';
import { stringify } from 'qs';
import { useRouter } from 'next/router';

import { isFunction } from '@utils/assertion';

import type { IStringifyOptions } from 'qs';

const useUpdate = () => {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
};

export interface Options {
  navigateMode?: 'push' | 'replace';
  transitionOptions?: {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
  };
  stringifyOptions?: IStringifyOptions;
}

const baseStringifyConfig: IStringifyOptions = {
  skipNulls: true,
  addQueryPrefix: true,
  arrayFormat: 'indices',
};

type UrlState = Record<string, any>;

export const useUrlState = <S extends UrlState = UrlState>(
  initialState?: S | (() => S),
  options?: Options,
) => {
  type State = Partial<{ [key in keyof S]: any }>;
  const {
    navigateMode = 'push',
    transitionOptions,
    stringifyOptions,
  } = options || {};

  const mergedStringifyOptions = {
    ...baseStringifyConfig,
    ...stringifyOptions,
  };

  const router = useRouter();

  const update = useUpdate();

  const initialStateRef = useRef(
    isFunction(initialState) ? (initialState as () => S)() : initialState || {},
  );

  const targetQuery: State = useMemo(
    () => ({
      ...initialStateRef.current,
      ...router.query,
    }),
    [router.query],
  );

  const setState = useCallback(
    (s: React.SetStateAction<State>) => {
      const newQuery = isFunction(s) ? s(targetQuery) : s;

      update();
      router[navigateMode](
        {
          search: stringify(
            {
              ...router.query,
              ...newQuery,
            },
            mergedStringifyOptions,
          ),
        },
        undefined,
        transitionOptions,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, navigateMode, transitionOptions],
  );

  return [targetQuery, setState] as const;
};
