import React, { useReducer, useMemo, useContext } from 'react';

enum ACTION_TYPE {
  SHOW_MODAL = 'SHOW_MODAL',
  HIDE_MODAL = 'HIDE_MODAL',
}

interface State {
  isModalOpen: boolean;
  okHandler?: (...args: any[]) => any;
  cancelHandler?: (...args: any[]) => any;
  options?: Record<string, string | number>;
}

interface Dispatch {
  showModal: (payload: Omit<State, 'isModalOpen'>) => void;
  hideModal: () => void;
}

const initialState: State = {
  isModalOpen: false,
  okHandler: undefined,
  cancelHandler: undefined,
  options: undefined,
};

const ModalContext = React.createContext<State>(initialState);

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case ACTION_TYPE.SHOW_MODAL:
      return {
        ...state,
        isModalOpen: true,
        okHandler: action.okHandler,
        cancelHandler: action.cancelHandler,
        options: action.options,
      };
    case ACTION_TYPE.HIDE_MODAL:
      return initialState;
    default:
      return state;
  }
}

export function ModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showModal = ({
    okHandler,
    cancelHandler,
    options,
  }: Omit<State, 'isModalOpen'>) =>
    dispatch({
      type: ACTION_TYPE.SHOW_MODAL,
      okHandler,
      cancelHandler,
      options,
    });

  const hideModal = () => dispatch({ type: ACTION_TYPE.HIDE_MODAL });

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
      showModal,
      hideModal,
    }),
    [state],
  );

  return (
    <ModalContext.Provider value={actions}>{children}</ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext<any>(ModalContext);
  if (!context) throw new Error('ModalContext not found');
  return context as State & Dispatch;
}
