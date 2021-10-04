import React, { useReducer, useMemo, useContext } from 'react';
import { getUserInfo } from '@utils/utils';

import type { StorageUserInfo } from 'type/app-api';

enum ACTION_TYPE {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

interface State {
  userInfo: StorageUserInfo | null;
}

interface Dispatch {
  authorize: (userInfo: StorageUserInfo) => void;
  unauthorize: () => void;
}
const initialState: State = {
  userInfo: typeof window === 'undefined' ? null : getUserInfo(),
};

const AuthContext = React.createContext<State>(initialState);

function reducer(state = initialState, action: any) {
  switch (action.type) {
    // ** 로그인
    case ACTION_TYPE.LOGIN:
      return { ...state, userInfo: action.userInfo };
    // ** 로그아웃
    case ACTION_TYPE.LOGOUT:
      return { ...state, userInfo: null };
    default:
      return state;
  }
}

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authorize = (userInfo: StorageUserInfo) =>
    dispatch({ type: ACTION_TYPE.LOGIN, userInfo });

  const unauthorize = () => dispatch({ type: ACTION_TYPE.LOGOUT });

  const actions = useMemo(
    () => ({
      ...state,
      authorize,
      unauthorize,
      dispatch,
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={actions}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext<any>(AuthContext);
  if (!context) throw new Error('AuthContext not found');
  return context as State & Dispatch;
}
