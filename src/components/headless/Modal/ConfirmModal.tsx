import React, { useEffect, useRef } from 'react';

import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock';
import classNames from 'classnames';

import { isFunction, isPromise } from '@utils/assertion';

// hooks
import { useOutsideClick } from '@hooks/useOutsideClick';
import { useMountedState } from 'react-use';

// components
import Content from './Content';
import { Portal } from '@provider/contexts';

// types
import type { ContentProps } from './Content';

export interface ConfirmModalProps extends ContentProps {
  type?: 'confirm';
  visible?: boolean;
  hasOutSideClick?: boolean;
  hasScrollBlock?: boolean;
  closable?: boolean;
  cancelText?: React.ReactNode;
  okText?: React.ReactNode;
  onOk?: ((...args: any[]) => void) | ((...args: any[]) => Promise<void>);
  onCancel?: ((...args: any[]) => void) | ((...args: any[]) => Promise<void>);
  onOutsideClickHandler?:
    | ((...args: any[]) => void)
    | ((...args: any[]) => Promise<void>);
  afterClose?: () => void;
  close?: (...args: any[]) => void;

  // props
  okButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const {
    visible = false,
    hasOutSideClick = false,
    hasScrollBlock = false,
    closable = false,
    okText = 'Ok',
    cancelText,
    title,
    content,
    onCancel,
    onOk,
    close,
    onOutsideClickHandler,
    ...reset
  } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const mountedState = useMountedState();

  const withClose = async (
    e: any,
    fnName: 'onCancel' | 'onOk' | 'onOutsideClickHandler',
  ) => {
    const compositionFn = {
      onOk: onOk || close,
      onCancel: onCancel || close,
      onOutsideClickHandler,
    };

    const fn = compositionFn[fnName];
    if (fn && isPromise(fn)) {
      await fn(e);
    } else if (fn && isFunction(fn)) {
      fn(e);
    }

    if (!visible) return;

    if (isFunction(props.afterClose)) {
      props.afterClose();
    }

    close?.();
  };

  const handleCancel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    withClose(e, 'onCancel');
  };

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    withClose(e, 'onOk');
  };

  const handleOutSideClick = async (e: Event) => {
    withClose(e, 'onOutsideClickHandler');
  };

  const Footer = () => {
    return (
      <>
        {cancelText && (
          <button
            type="button"
            onClick={handleCancel}
            {...reset.cancelButtonProps}
          >
            {cancelText}
          </button>
        )}
        <button type="button" onClick={handleOk} {...reset.okButtonProps}>
          {okText}
        </button>
      </>
    );
  };

  useOutsideClick({
    enabled: visible && hasOutSideClick,
    ref: ref as React.RefObject<HTMLElement>,
    handler: handleOutSideClick,
  });

  useEffect(() => {
    if (hasScrollBlock) {
      const isMounted = mountedState();
      if (!isMounted) return;

      if (visible) {
        disableBodyScroll(document.body);
      } else {
        enableBodyScroll(document.body);
      }
    }

    return () => {
      if (hasScrollBlock) {
        clearAllBodyScrollLocks();
      }
    };
  }, [visible, mountedState, hasScrollBlock]);

  if (!visible) return null;

  return (
    <Portal>
      <div>
        <div ref={ref}>
          {closable && <button type="button" onClick={handleCancel}></button>}
          <Content
            title={title}
            content={content}
            footer={<Footer />}
            footerProps={reset.footerProps}
            bodyProps={reset.bodyProps}
            titleProps={reset.titleProps}
            descriptionProps={reset.descriptionProps}
            contentProps={reset.contentProps}
          />
        </div>
      </div>
    </Portal>
  );
};

export default ConfirmModal;
