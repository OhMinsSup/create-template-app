import React, { useReducer, useMemo, useContext } from 'react';

enum ACTION_TYPE {
  SET_PAGE_LOADING = 'SET_PAGE_LOADING',
}

interface State {
  isPageLoading: boolean;
}

interface Dispatch {
  showPageLoading: () => void;
  hiddenPageLoading: () => void;
}

const initialState: State = {
  isPageLoading: false,
};

const LayoutContext = React.createContext<State>(initialState);

function reducer(state = initialState, action: any) {
  switch (action.type) {
    // 페이지 로딩 상태
    case ACTION_TYPE.SET_PAGE_LOADING:
      return { ...state, isPageLoading: action.isPageLoading };
    default:
      return state;
  }
}

export function LayoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showPageLoading = () =>
    dispatch({ type: ACTION_TYPE.SET_PAGE_LOADING, isPageLoading: true });

  const hiddenPageLoading = () =>
    dispatch({ type: ACTION_TYPE.SET_PAGE_LOADING, isPageLoading: false });

  const actions = useMemo(
    () => ({
      ...state,
      showPageLoading,
      hiddenPageLoading,
      dispatch,
    }),
    [state],
  );

  return (
    <LayoutContext.Provider value={actions}>{children}</LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  const context = useContext<any>(LayoutContext);
  if (!context) throw new Error('LayoutContext not found');
  return context as State & Dispatch;
}
