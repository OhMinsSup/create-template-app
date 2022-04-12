import React, { useState, useImperativeHandle } from 'react';
import ConfirmModal from './ConfirmModal';

import type { ConfirmModalProps } from './ConfirmModal';

export interface HookModalProps {
  afterClose: () => void;
  config: ConfirmModalProps;
}

export interface HookModalRef {
  destroy: () => void;
  update: (config: ConfirmModalProps) => void;
}

const HookModal: React.ForwardRefRenderFunction<
  HookModalRef,
  HookModalProps
> = ({ afterClose, config }, ref) => {
  const [visible, setVisible] = useState(true);
  const [innerConfig, setInnerConfig] = useState(config);

  const close = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    destroy: close,
    update: (newConfig: ConfirmModalProps) => {
      setInnerConfig((originConfig) => ({
        ...originConfig,
        ...newConfig,
      }));
    },
  }));

  return (
    <ConfirmModal
      {...innerConfig}
      close={close}
      visible={visible}
      afterClose={afterClose}
      okText={innerConfig.okText}
      cancelText={innerConfig.cancelText}
    />
  );
};

export default React.forwardRef(HookModal);
