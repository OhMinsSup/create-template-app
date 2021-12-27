export interface UserInfoSchema extends Record<string, any> {}

export enum Action {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SET_USER_INFO = 'SET_USER_INFO',
}

export type LoginAction = {
  type: Action.LOGIN;
};

export type LogoutAction = {
  type: Action.LOGOUT;
};

export type SetUserInfoAction = {
  type: Action.SET_USER_INFO;
  payload: UserInfoSchema | null;
};

export type ActionType = LoginAction | LogoutAction | SetUserInfoAction;
