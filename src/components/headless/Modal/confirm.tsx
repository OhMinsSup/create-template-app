import React from 'react';
import ReactDOM from 'react-dom';

// components
import ConfirmModal from './ConfirmModal';

//
import { isFunction } from '@utils/assertion';

// types
import type { ConfirmModalProps } from './ConfirmModal';

export type ConfigUpdate =
  | ConfirmModalProps
  | ((prevConfig: ConfirmModalProps) => ConfirmModalProps);

export type ModalFunc = (props: ConfirmModalProps) => {
  destroy: () => void;
  update: (configUpdate: ConfigUpdate) => void;
};

export type ModalStaticFunctions = Record<
  NonNullable<ConfirmModalProps['type']>,
  ModalFunc
>;

export const destroyFns: Array<() => void> = [];

export function confirm(config: ConfirmModalProps) {
  const container = document.createDocumentFragment();

  let currentConfig = {
    ...config,
    close,
    afterClose: () => {
      if (isFunction(config.afterClose)) {
        config.afterClose();
      }
      // @ts-ignore
      destroy.apply(this);
    },
    visible: true,
  } as any;

  // dom에서 제거
  function destroy() {
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }

    ReactDOM.unmountComponentAtNode(container);
  }

  // 렌더링
  function render({ okText, cancelText, ...props }: any) {
    // 동기 렌더링은 리액트의 이벤트를 차단하기 때문에 모달 생성에 이슈가 발생
    // 그래서 비동기 형태로 변경
    setTimeout(() => {
      ReactDOM.render(
        <ConfirmModal {...props} okText={okText} cancelText={cancelText} />,
        container,
      );
    });
  }

  // 닫기
  function close() {
    currentConfig = {
      ...currentConfig,
      visible: false,
    };
    render(currentConfig);
  }

  // 업데이트
  function update(configUpdate: ConfigUpdate) {
    if (isFunction(configUpdate)) {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate,
      };
    }
    render(currentConfig);
  }

  render(currentConfig);

  destroyFns.push(close);

  return {
    destroy: close,
    update,
  };
}

export default confirm;
