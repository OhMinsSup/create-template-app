import i18n from '@locales/i18n';
import * as yup from 'yup';

export const passwordSchema = yup
  .string()
  .test('password', i18n.t('validation:passwordFormat'), (password) => {
    if (!password) return false;

    if (password.trim() === 'password') {
      return true;
    }

    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    if (password.match(regex)) {
      return true;
    }

    return false;
  })
  .required(i18n.t('validation:password'));

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email(i18n.t('validation:email'))
    .required(i18n.t('validation:email')),
  password: passwordSchema,
});

export const signupSchema = yup.object().shape({
  type: yup.string().required(),
  email: yup.string().email().required(),
  name: yup.string().required(),
  phone: yup
    .string()
    .test('phone', i18n.t('validation:passwordFormat'), (val) => {
      return val && val.match(/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/)
        ? true
        : false;
    })
    .required(),
  nickname: yup
    .string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,20}$/)
    .required(),
  password: yup.string().when('type', {
    is: (val: string) => {
      return val === 'E';
    },
    then: yup
      .string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/,
      )
      .required(),
    otherwise: yup.string().notRequired(),
  }),
});
