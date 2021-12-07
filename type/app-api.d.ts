import type { AxiosResponse } from 'axios';
import type {
  GetServerSidePropsContext,
  GetStaticPathsContext,
  GetStaticPropsContext,
} from 'next';

// ================== Common =================== //

export interface ResponseSchema<DataModel = any, ErrorModel = any> {
  header: {
    resultCode: number;
    resultMessage: string;
  };
  data: DataModel;
  errorData: ErrorModel | null;
}

export type AppAPI<Data = any, Err = any> = ResponseSchema<Data, Err>;

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
  headers?: Record<string, string>;
  options?: Options;
}

export type SWR<Item = any, Error = any> = AxiosResponse<AppAPI<Item, Error>>;

export type SWRMock<Item = any> = AxiosResponse<Item>;
