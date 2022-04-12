import { confirm, destroyFns } from './confirm';
import ConfirmModal from './ConfirmModal';

// types
import type { ModalStaticFunctions } from './confirm';
import type { ConfirmModalProps } from './ConfirmModal';

type ModalType = typeof ConfirmModal &
  ModalStaticFunctions & {
    destroyAll: () => void;
  };

const Modal = ConfirmModal as ModalType;

// 모달 노출
Modal.confirm = function confirmFn(props: ConfirmModalProps) {
  return confirm(props);
};

// 모든 모달 삭제
Modal.destroyAll = function destroyAllFn() {
  while (destroyFns.length) {
    const close = destroyFns.pop();
    if (close) {
      close();
    }
  }
};

export default Modal;
