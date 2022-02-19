import React, {
  useMemo,
  useState,
  isValidElement,
  useEffect,
  useRef,
} from 'react';
import { Modal } from 'antd';

interface AlertOptions {
  key?: number;
  Component?:
    | string
    | React.FunctionComponent<any>
    | React.ComponentClass<any, any>;
  content?: Record<string, string | number | React.ReactNode>;
  okHandler?: (...args: any[]) => any;
  cancelHandler?: (...args: any[]) => any;
  showCancel?: boolean;
}

const defaultOptions: AlertOptions = {
  key: 0,
  content: {
    title: '',
    text: '',
    cancelText: '취소',
    confirmText: '확인',
  },
  Component: undefined,
  okHandler: undefined,
  cancelHandler: undefined,
  showCancel: false,
};

let key = 1;
const alertManager = new Map<number, AlertOptions>();

function getKeyThenIncreaseKey() {
  return key++;
}

export function useAlert() {
  const [isAlertOpen, setAlertOpen] = useState(false);
  const keyRef = useRef<number | null>(key);

  const alertInstance = useMemo(() => {
    return (visible: boolean, options: AlertOptions) => {
      console.log('current alert info:', alertManager);
      if (keyRef.current) {
        visible
          ? alertManager.set(keyRef.current, options)
          : alertManager.delete(keyRef.current);
      }

      setAlertOpen(visible);
    };
  }, []);

  // show
  const showAlert = (options: Partial<AlertOptions> = defaultOptions) => {
    const key = keyRef.current ?? getKeyThenIncreaseKey();

    if (!options?.cancelHandler) {
      options.cancelHandler = () => {
        alertInstance(false, options);
      };
    }

    if (!options?.okHandler) {
      options.okHandler = () => {
        alertInstance(false, options);
      };
    }

    if (key !== keyRef.current) {
      keyRef.current = key;
    }

    const alertOptions = {
      ...options,
      key,
    };

    alertInstance(true, alertOptions);
    console.log('showAlert:', alertManager);
  };

  // close
  const closeAlert = () => {
    alertInstance(false, defaultOptions);
  };

  // current instance
  const getInstance = () =>
    keyRef.current ? alertManager.get(keyRef.current) : null;

  // current key
  const getKey = () => keyRef.current;

  // alert component
  const Alert = () => {
    const alert = getInstance();
    if (!alert) return null;

    const { okHandler, cancelHandler, content, showCancel, Component } = alert;

    // custom alert component
    if (Component) {
      return React.createElement(Component, {
        okHandler,
        cancelHandler,
        content,
        showCancel,
        isAlertOpen,
        getInstance,
        getKey,
      });
    }

    return (
      <Modal
        visible={isAlertOpen}
        onOk={() => false}
        onCancel={() => false}
        width={310}
        centered
        footer={[
          <React.Fragment key={`alert-${key}-cancel`}>
            {showCancel && (
              <button
                className="btn btn-normal btn-modal"
                onClick={cancelHandler}
              >
                {content?.cancelText ?? '취소'}
              </button>
            )}
          </React.Fragment>,
          <button
            key={`alert-${key}-confirm`}
            className="btn btn-primary btn-modal"
            onClick={okHandler}
          >
            {content?.confirmText ?? '확인'}
          </button>,
        ]}
      >
        <div className="modal-body-content">
          {isValidElement(content?.text) ? (
            content?.text
          ) : (
            <p style={{ whiteSpace: 'pre-line' }}>{content?.text}</p>
          )}
        </div>
      </Modal>
    );
  };

  // clear
  useEffect(() => {
    return () => {
      console.log('delete start....');
      const deleteKey = keyRef.current;
      if (alertManager.size > 0 && deleteKey) {
        alertManager.delete(deleteKey);
        keyRef.current = null;
        console.log(
          'success delete: key =>',
          deleteKey,
          ' manager =>',
          alertManager,
        );
      }
    };
  }, []);

  return {
    isAlertOpen,
    getInstance,
    getKey,
    closeAlert,
    showAlert,
    Alert,
  };
}
