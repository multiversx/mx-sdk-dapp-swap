import { useCallback, useEffect } from 'react';
import { useQuery, DocumentNode, QueryHookOptions } from '@apollo/client';
import { useAuthorizationContext } from 'components/SwapAuthorizationProvider';
import { POLLING_INTERVAL } from 'constants/index';
import { useIsPageVisible } from 'hooks';

export const useQueryWrapper = <TData>({
  query,
  queryOptions,
  refetchTrigger,
  isPollingEnabled = false,
  isRefetchEnabled = false
}: {
  query: DocumentNode;
  refetchTrigger?: number;
  isPollingEnabled?: boolean;
  isRefetchEnabled?: boolean;
  queryOptions?: QueryHookOptions<TData>;
}) => {
  const isPageVisible = useIsPageVisible();
  const { client } = useAuthorizationContext();

  const {
    error,
    loading,
    previousData,
    data = previousData,
    refetch: internalRefetch,
    stopPolling,
    startPolling,
    ...rest
  } = useQuery<TData>(query, {
    client,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache', // used for first run
    nextFetchPolicy: 'no-cache', // used for subsequent runs
    ...queryOptions
  });

  // polling must be sincronized with manual requests
  const startPollingCallback = useCallback(() => {
    stopPolling();

    if (isPageVisible && isPollingEnabled && !error && !queryOptions?.skip) {
      startPolling(POLLING_INTERVAL);
    }
  }, [
    error,
    isPageVisible,
    isPollingEnabled,
    queryOptions?.skip,
    queryOptions?.variables
  ]);

  const refetch = () => {
    internalRefetch();
    startPollingCallback();
  };

  // mount and unmount
  useEffect(() => {
    startPollingCallback();

    return () => {
      stopPolling();
    };
  }, [startPollingCallback]);

  useEffect(() => {
    const isInitialRenderRefetch = refetchTrigger === 0;

    if (!isRefetchEnabled || isInitialRenderRefetch) {
      return;
    }

    refetch();
    startPollingCallback();
  }, [refetchTrigger, isRefetchEnabled]);

  const isLoading = data == null && loading;
  const isError = Boolean(error);
  const isRefetching = loading;

  return {
    data,
    error,
    isError,
    isLoading,
    isRefetching,
    refetch,
    ...rest
  };
};
