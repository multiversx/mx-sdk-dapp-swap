import { Dispatch, SetStateAction, useEffect } from 'react';
import { TokensPaginationType, UserEsdtType } from 'types';

interface UseIntersectionObserverType {
  hasMore: boolean;
  pageSize: number;
  observerId: string;
  isLoading: boolean;
  currentCursor: string;
  tokens: UserEsdtType[];
  loadedCursors: Set<string>;
  setPagination: Dispatch<SetStateAction<TokensPaginationType>>;
}

export const useIntersectionObserver = ({
  tokens,
  hasMore,
  pageSize,
  isLoading,
  observerId,
  loadedCursors,
  currentCursor,
  setPagination
}: UseIntersectionObserverType) => {
  useEffect(() => {
    if (!observerId) return;
    const element = document.getElementById(observerId);
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          // Check if the current cursor is already loaded
          if (currentCursor && !loadedCursors.has(currentCursor)) {
            const newPagination = {
              first: pageSize,
              after: currentCursor
            };

            setPagination(newPagination);
          }
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [tokens, observerId]);
};
