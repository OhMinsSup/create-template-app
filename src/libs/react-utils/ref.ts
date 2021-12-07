import { isFunction } from '@utils/assertion';

import type { Ref, RefObject, MutableRefObject } from 'react';

type ReactRef<T> = Ref<T> | RefObject<T> | MutableRefObject<T>;

/**
 * 참조 함수 또는 객체에 값을 할당
 * @param ref ref 할당할 ref
 * @param value 값
 */
export function assignRef<T>(ref: ReactRef<T> | undefined, value: T): void {
  if (ref == null) return;

  if (isFunction(ref)) {
    ref(value);
    return;
  }

  try {
    // @ts-ignore
    ref.current = value;
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
  }
}

/**
 * 여러 React ref를 단일 ref 함수로 결합합니다.
 * 이것은 소비자가 참조를 다음으로 전달하도록 허용해야 할 때 주로 사용
 *
 * @param refs refs 값에 할당할 참조
 */
export function mergeRefs<T>(...refs: (ReactRef<T> | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}
