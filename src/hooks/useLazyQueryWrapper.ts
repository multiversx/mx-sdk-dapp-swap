import { useRef, useState } from 'react';
import {
  DocumentNode,
  QueryHookOptions,
  LazyQueryHookOptions,
  OperationVariables
} from '@apollo/client';
import { useAuthorizationContext } from 'components/SwapAuthorizationProvider';

export const useLazyQueryWrapper = <TData>({
  query,
  queryOptions
}: {
  query: DocumentNode;
  queryOptions?: QueryHookOptions<TData>;
}) => {
  const { client } = useAuthorizationContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const queryVariables = useRef<OperationVariables>();

  const executeQuery = async (
    options?: Partial<LazyQueryHookOptions<TData>>
  ) => {
    queryVariables.current = options?.variables ?? queryOptions?.variables;

    try {
      setIsLoading(true);

      const response = await client?.query({
        query,
        variables: queryVariables?.current
      });

      const responseData = response?.data;

      if (response?.error) {
        setIsLoading(false);
        setIsError(true);
        console.error(response.error);
        return null;
      }

      if (responseData) {
        const onCompleted = options?.onCompleted ?? queryOptions?.onCompleted;
        onCompleted?.(responseData);
      }

      setIsLoading(false);

      return responseData;
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
      console.error(e);
      return null;
    }
  };

  const refetch = (variables?: Partial<OperationVariables>) => {
    if (!queryVariables.current) {
      console.log('Refetch query was executed before the actual query.');
      return;
    }

    const refetchVariables = variables ?? queryVariables.current;

    executeQuery({
      ...queryOptions,
      variables: refetchVariables
    });
  };

  return {
    isLoading,
    isError,
    execute: executeQuery,
    refetch
  };
};
