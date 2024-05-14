import { useState } from 'react';
import {
  DocumentNode,
  useApolloClient,
  QueryHookOptions,
  LazyQueryHookOptions
} from '@apollo/client';

export const useLazyQueryWrapper = <TData>({
  query,
  queryOptions
}: {
  query: DocumentNode;
  queryOptions?: QueryHookOptions<TData>;
}) => {
  const apolloClient = useApolloClient();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isError, setIsError] = useState<boolean>();
  const [error, setError] = useState<string>();

  const execute = async (options?: Partial<LazyQueryHookOptions<TData>>) => {
    const onCompleted = options?.onCompleted ?? queryOptions?.onCompleted;
    const variables = options?.variables ?? queryOptions?.variables;

    try {
      setIsLoading(true);

      const response = await apolloClient.query<TData>({
        query,
        variables
      });

      const responseData = response?.data;
      const errors = response?.errors;

      if (errors && errors.length > 0) {
        setIsError(true);
        setError(errors[0].message);
      }

      if (responseData) {
        setIsError(false);
        setError(undefined);
        onCompleted?.(responseData);
      }

      setIsLoading(false);

      return responseData;
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
      console.error(e);
      return;
    }
  };

  return {
    isLoading,
    isError,
    error,
    execute
  };
};
