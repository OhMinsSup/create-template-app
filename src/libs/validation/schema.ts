import * as yup from 'yup';

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
  nickname: yup
    .string()
    .min(2, '2자 이상 입력해주세요.')
    .max(20, '20자 이하로 입력해주세요.'),
};

export const schema = {
  signup: yup.object().shape({
    email: common.email.required('이메일을 입력해 주세요.'),
    password: common.password.required('비밀번호를 입력해 주세요.'),
    nickname: common.nickname.required('닉네임을 입력해 주세요.'),
    code: yup.string().required('초대코드를 입력해 주세요.'),
  }),
  signin: yup.object().shape({
    email: common.email.required('이메일을 입력해 주세요.'),
    password: common.password.required('비밀번호를 입력해 주세요.'),
  }),
  reset: yup.object().shape({
    oldPassword: common.password.required('현재 비밀번호를 입력해 주세요.'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('oldPassword'), null], '비밀번호가 일치하지 않습니다.'),
    password: common.password.required('비밀번호를 입력해 주세요.'),
  }),
  resned: yup.object().shape({
    email: common.email.required('이메일을 입력해 주세요.'),
  }),
};
