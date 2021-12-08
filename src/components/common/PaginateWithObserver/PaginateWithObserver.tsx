import React, { useRef } from 'react';
import { useIntersectionObserver } from '@hooks/useIntersectionObserver';

import type { KeyedMutator } from 'swr';
import type { useInfiniteList, useInfinitePages } from '@libs/swr-utils';

const Noop: React.FC = ({ children }) => <>{children}</>;

interface PaginateWithObserverProps
  extends ReturnType<typeof useInfiniteList>,
    ReturnType<typeof useInfinitePages> {
  mutate: KeyedMutator<any>;
  loading?: React.ReactNode;
}
const PaginateWithObserver: React.FC<PaginateWithObserverProps> = ({
  action,
  status,
  loading,
  list,
}) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { error } = list;
  const { isLoadingMore, isReachingEnd, isEmptyData, isLoadingInitialData } =
    status;
  const { onIntersection } = action;

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: onIntersection,
    enabled: !(isLoadingMore || isReachingEnd),
  });

  return (
    <>
      {error || isEmptyData
        ? null
        : !isLoadingInitialData && (
            <div ref={loadMoreRef}>
              {isLoadingMore && <Noop>{loading}</Noop>}
            </div>
          )}
    </>
  );
};

export default PaginateWithObserver;
