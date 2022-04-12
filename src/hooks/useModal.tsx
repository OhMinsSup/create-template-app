import React, {
  useState,
  useRef,
  createRef,
  useMemo,
  useCallback,
  useImperativeHandle,
} from 'react';
import HookModal from '@components/headless/Modal/HookModal';
import type { ConfirmModalProps } from '@components/headless/Modal/ConfirmModal';
import type { HookModalRef } from '@components/headless/Modal/HookModal';

let uuid = 0;

interface ElementsHolderRef {
  patchElement: (element: React.ReactElement) => () => void;
}

// eslint-disable-next-line react/display-name
const ElementsHolder = React.memo(
  React.forwardRef<ElementsHolderRef>((_props, ref) => {
    // 실제로 모달이 렌더링되는 elements
    const [elements, setElements] = useState<React.ReactElement[]>([]);

    const patchElement = useCallback((element: React.ReactElement) => {
      // elements에 새 elements를 추가
      setElements((originElements) => [...originElements, element]);

      return () => {
        // elements에서 삭제
        setElements((originElements) =>
          originElements.filter((ele) => ele !== element),
        );
      };
    }, []);

    /**
     * 상위 Components에 현재 ref와 elements를 삭제, 추가하는 함수를 넘겨줌
     * */
    useImperativeHandle(
      ref,
      () => ({
        patchElement,
      }),
      [],
    );

    return <>{elements}</>;
  }),
);

export const useModal = () => {
  const holderRef = useRef<ElementsHolderRef>(null as any);

  const getConfirmFunc = useCallback(
    () =>
      function hookConfirm(config: ConfirmModalProps) {
        /**
         * 고유한 id를 생성해서 각각의 Modal을 구분하기 위함
         */
        uuid += 1;

        // 현재 modal에 대한 내부 정보를 저장하는 ref
        const modalRef = createRef<HookModalRef>();

        // eslint-disable-next-line prefer-const
        let closeFunc: () => void | undefined;
        const modal = (
          <HookModal
            key={`cyphrly-modal-${uuid}`}
            config={{ ...config }}
            ref={modalRef}
            afterClose={() => {
              console.log('useModal - afterClose');
              closeFunc?.();
            }}
          />
        );

        /**
         * holderRef는 hooks로 넘겨주는 두번째 파라미터에 components로
         * modal로 넘겨준 컴포넌트가 노출이됨
         */
        closeFunc = holderRef.current?.patchElement(modal);

        return {
          destroy: () => {
            // 모달 삭제
            function destroyAction() {
              modalRef.current?.destroy();
            }

            if (modalRef.current) {
              destroyAction();
            }
          },
          update: (newConfig: ConfirmModalProps) => {
            // 모달 설정 업데이트
            function updateAction() {
              modalRef.current?.update(newConfig);
            }

            if (modalRef.current) {
              updateAction();
            }
          },
        };
      },
    [],
  );

  const fns = useMemo(
    () => ({
      confirm: getConfirmFunc(),
    }),
    [],
  );

  // eslint-disable-next-line react/jsx-key
  return [fns, <ElementsHolder ref={holderRef} />] as const;
};
