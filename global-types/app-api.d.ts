import type { AxiosResponse } from 'axios';
import type {
  GetServerSidePropsContext,
  GetStaticPathsContext,
  GetStaticPropsContext,
} from 'next';

// ================== Common =================== //

export interface Schema<DataModel = any, ErrorModel = any> {
  header: {
    resultCode: number;
    resultMessage: string;
  };
  data: DataModel;
  errorData: ErrorModel | null;
}

export type AppAPI<Data = any, Err = any> = Schema<Data, Err>;

export interface Options<Data = any> {
  fallbackData?: Data | null;
  context:
    | GetStaticPropsContext
    | GetServerSidePropsContext
    | GetStaticPathsContext
    | null;
  enable?: boolean | null;
}

export interface Params<Body = any> {
  url: string;
  body?: Body;
  config?: AxiosRequestConfig | undefined;
  options?: Options;
}

export type SWR<Item = any, Error = any> = AxiosResponse<AppAPI<Item, Error>>;

export type SWRMock<Item = any> = AxiosResponse<Item>;
