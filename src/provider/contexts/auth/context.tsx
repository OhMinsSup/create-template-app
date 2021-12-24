import React, { useReducer, useMemo } from 'react';
import { createContext } from '@libs/react-utils';
import { Action } from './types';

import type { ActionType, UserInfoSchema } from './types';

interface AuthState {
  userInfo: UserInfoSchema | null;
}

interface AuthContext extends AuthState {
  authorize: (userInfo: UserInfoSchema) => void;
  unauthorize: () => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: AuthState = {
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
        userInfo: action.payload,
      };
    case Action.LOGOUT:
      return {
        ...state,
        userInfo: null,
      };
    default:
      return state;
  }
}

function AuthProvider({ children }: AuthProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authorize = (userInfo: UserInfoSchema) =>
    dispatch({
      type: Action.LOGIN,
      payload: userInfo,
    });

  const unauthorize = () =>
    dispatch({
      type: Action.LOGOUT,
    });

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
      authorize,
      unauthorize,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { AuthProvider, useAuthContext };
