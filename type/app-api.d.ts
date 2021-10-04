import type { AxiosResponse } from 'axios';
import type {
  GetServerSidePropsContext,
  GetStaticPathsContext,
  GetStaticPropsContext,
} from 'next';

// ================== Storage ================== //

export interface StorageUserInfo {}

export interface StorageSocialTemp {}

// ================== Common =================== //

export interface ResponseModel<DataModel = any, ErrorModel = any> {
  header: {
    resultCode: number;
    resultMessage: string;
  };
  data: DataModel;
  errorData: ErrorModel | null;
}

export type appAPI<DataModel = any, ErrModel = any> = ResponseModel<
  DataModel,
  ErrModel
>;

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
  headers?: {
    [key: string]: string;
  };
  options?: Options;
}

export interface UploadParams {
  file: File;
  storeType: any;
  resize?: boolean;
  fileIdx?: number;
}

export type SWR<Item = any, Error = any> = AxiosResponse<appAPI<Item, Error>>;

export type SWRMock<Item = any> = AxiosResponse<Item>;

// ================== Example =================== //

export interface PostModel {
  createdAt: string;
  username: string;
  title: string;
  body: string;
  id: string;
}
