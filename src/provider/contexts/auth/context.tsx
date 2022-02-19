import React, { useReducer, useMemo } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';

import { createContext } from '@libs/react-utils';

import { Action } from './types';
import type { ActionType, UserInfoSchema } from './types';

interface AuthState {
  isLoggedIn: boolean;
  userInfo: UserInfoSchema | null;
}

interface AuthContext extends AuthState {
  setUserInfo: (userInfo: UserInfoSchema | null) => void;
  login: () => void;
  logout: () => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userInfo: null,
};

const [Provider, useAuthContext] = createContext<AuthContext>({
  name: 'useAuthContext',
  errorMessage: 'useAuthContext: `context` is undefined.',
  defaultValue: initialState,
});

interface AuthProps {
  children: React.ReactNode;
}

function reducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case Action.LOGIN:
      return {
        ...state,
        isLoggedIn: true,
      };
    case Action.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
      };
    case Action.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return state;
  }
}

function AuthProvider({ children }: AuthProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUserInfo = (userInfo: UserInfoSchema | null) =>
    dispatch({
      type: Action.SET_USER_INFO,
      payload: userInfo,
    });

  const login = () => dispatch({ type: Action.LOGIN });

  const logout = () => dispatch({ type: Action.LOGOUT });

  useIsomorphicLayoutEffect(() => {
    if (!state.isLoggedIn) {
      const token = null;
      if (token) login();
    }
  }, [state.isLoggedIn]);

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
      login,
      logout,
      setUserInfo,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { AuthProvider, useAuthContext };
