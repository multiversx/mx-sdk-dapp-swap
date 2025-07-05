import React from 'react';
import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  split
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
  const authMiddleware = setContext(async (req, { headers }) => {
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

    const authorizationHeaders = await getAuthorizationHeaders?.(requestParams);

    const authorizationBearerHeader = accessToken
      ? {
          Authorization: `Bearer ${accessToken}`
        }
      : {};

    return {
      headers: {
        ...headers,
        ...authorizationBearerHeader,
        ...authorizationHeaders
      }
    };
  });

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

  const httpLink = new HttpLink({
    uri: graphQLAddress
  });

  const wsLink = new WebSocketLink({
    uri: graphQLAddress,
    options: {
      reconnect: true
    }
  });

  // Split traffic between HTTP and WebSocket
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link: from([authMiddleware, errorLink, splitLink]),
    cache: new InMemoryCache(),
    queryDeduplication: false,
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
  });

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
