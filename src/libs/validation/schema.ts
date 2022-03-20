import { isObject, isUndefined } from '@utils/assertion';
import * as yup from 'yup';

function compact<T>(array: T[]): T[] {
  return array.filter(Boolean);
}

const isNullOrUndefined = (value: unknown): value is null | undefined =>
  value == null;

export function getError<T>(obj: T, path: string, defaultValue?: unknown): any {
  if (!path || !isObject(obj)) {
    return defaultValue;
  }

  const result = compact(path.split(/[,[\].]+?/)).reduce(
    (result, key) =>
      // eslint-disable-next-line @typescript-eslint/ban-types
      isNullOrUndefined(result) ? result : result[key as keyof {}],
    obj,
  );

  return isUndefined(result) || result === obj
    ? isUndefined(obj[path as keyof T])
      ? defaultValue
      : obj[path as keyof T]
    : result;
}

export const common = {
  email: yup.string().email('이메일 형식으로 입력해 주세요.'),
  password: yup
    .string()
    .test('password', '비밀번호를 입력해 주세요.', (password) => {
      if (!password) return false;
      const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%&^*+=-\d])(?=.*[0-9]).{8,20}$/;
      if (password.match(regex)) {
        return true;
      }
      return false;
    }),
};

export const schema = {
  signup: yup.object().shape({
    email: common.email.required('이메일을 입력해 주세요.'),
    password: common.password.required('비밀번호를 입력해 주세요.'),
  }),
  signin: yup.object().shape({
    email: common.email.required('이메일을 입력해 주세요.'),
    password: common.password.required('비밀번호를 입력해 주세요.'),
  }),
};
