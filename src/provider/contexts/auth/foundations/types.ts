export interface UserInfoSchema extends Record<string, any> {}

export enum Action {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export type LoginAction = {
  type: Action.LOGIN;
  payload: UserInfoSchema;
};

export type LogoutAction = {
  type: Action.LOGOUT;
};

export type ActionType = LoginAction | LogoutAction;
