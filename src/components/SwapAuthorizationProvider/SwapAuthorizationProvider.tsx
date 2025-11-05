import React, { useMemo } from 'react';
import {
  from,
  split,
  HttpLink,
  ApolloClient,
  InMemoryCache
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { print } from 'graphql';
import {
  SwapGraphQLAddressEnum,
  AuthorizationHeadersRequestParamsType
} from 'types';
import { AuthorizationContext } from './context';

export const SwapAuthorizationProvider = ({
  children,
  accessToken,
  graphQLAddress,
  getAuthorizationHeaders
}: {
  accessToken?: string;
  children: React.ReactNode;
  graphQLAddress: SwapGraphQLAddressEnum | string;
  getAuthorizationHeaders?: (
    requestParams: AuthorizationHeadersRequestParamsType
  ) => Promise<void | null | Record<string, string>>;
}) => {
  const authMiddleware = useMemo(
    () =>
      setContext(async (req, { headers }) => {
        // start - specific to xPortal
        const requestParams: AuthorizationHeadersRequestParamsType = {
          url: graphQLAddress,
          params: req?.variables,
          body: {
            operationName: req?.operationName,
            variables: req?.variables,
            query: print(req?.query)
          },
          method: 'POST'
        };

        const requestedAuthorizationHeaders = await getAuthorizationHeaders?.(
          requestParams
        );
        // end - specific to xPortal

        const authorization = accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {};

        return {
          headers: {
            ...headers,
            ...authorization,
            ...requestedAuthorizationHeaders
          }
        };
      }),
    [accessToken]
  );

  const httpLink = useMemo(() => {
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        });
      }

      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    });

    return from([errorLink, new HttpLink({ uri: graphQLAddress })]);
  }, [graphQLAddress]);

  const wsLink = useMemo(
    () =>
      new WebSocketLink({
        uri: graphQLAddress.replace('https', 'wss'),
        options: {
          reconnect: true
        }
      }),
    []
  );

  const splitLink = useMemo(
    () =>
      split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        authMiddleware.concat(httpLink)
      ),
    [wsLink, authMiddleware, httpLink]
  );

  const client = useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        link: authMiddleware.concat(splitLink),
        queryDeduplication: false, // FIX: fixes canceled queries not beeing sent to the server when retriggered
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
          },
          query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
          }
        }
      }),
    [authMiddleware, splitLink]
  );

  return (
    <AuthorizationContext.Provider
      value={{
        client,
        accessToken,
        isAuthenticated: Boolean(accessToken)
      }}
    >
      {children}
    </AuthorizationContext.Provider>
  );
};
