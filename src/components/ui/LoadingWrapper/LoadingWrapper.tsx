import React, { useRef } from 'react';

// utils
import { isEmpty } from '@utils/assertion';
import noop from 'lodash-es/noop';

// hooks
import { useIntersectionObserver } from '@hooks/useIntersectionObserver';

// types
import type { SWRResponse } from 'swr';

interface LoadingWrapperProps<Data = any, Error = any>
  extends Partial<
    Pick<SWRResponse<Data, Error>, 'data' | 'error' | 'isValidating'>
  > {
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  children?: React.ReactNode;
}

function LoadingWrapper(props: LoadingWrapperProps) {
  const {
    errorComponent = null,
    loadingComponent = <></>,
    emptyComponent = <></>,
    isValidating,
    data,
    error,
  } = props;

  if (isValidating) {
    // loading
    return <>{loadingComponent}</>;
  }

  if (error || isEmpty(data)) {
    if (error) {
      // error
      return <>{emptyComponent ?? errorComponent}</>;
    }
    // loading
    return <>{emptyComponent}</>;
  }

  // components
  return <>{props.children}</>;
}

export default LoadingWrapper;

interface LoadingWrapperForInfiniteScrollProps<Data = any, Error = any>
  extends Pick<
    LoadingWrapperProps<Data, Error>,
    'errorComponent' | 'loadingComponent' | 'children' | 'error'
  > {
  emptyComponent?: React.ReactNode;
  loadMoreLoadingComponent?: React.ReactNode;
  isLoadingInitialData: boolean; // 초기로딩
  isLoadingMore?: boolean; // 더보기 로딩
  isReachingEnd?: boolean; // 더보기 여부
  isEmptyData: boolean; // 데이터 없음
  onIntersect: (...args: any[]) => void;
}

LoadingWrapper.InfiniteSroll = function InfiniteSroll(
  props: LoadingWrapperForInfiniteScrollProps,
) {
  const {
    loadingComponent = <></>,
    loadMoreLoadingComponent = <></>,
    emptyComponent = <></>,
    onIntersect = noop,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isEmptyData,
  } = props;

  const ref = useRef<HTMLDivElement | null>(null);

  useIntersectionObserver({
    target: ref,
    onIntersect,
    enabled: !(isLoadingMore || isReachingEnd),
  });

  if (isLoadingInitialData) {
    return <>{loadingComponent}</>;
  }

  if (isEmptyData || props.error) {
    return <>{emptyComponent}</>;
  }

  return (
    <>
      {props.children}
      <div className="data-loader" ref={ref}>
        {isLoadingMore && <>{loadMoreLoadingComponent}</>}
      </div>
    </>
  );
};
