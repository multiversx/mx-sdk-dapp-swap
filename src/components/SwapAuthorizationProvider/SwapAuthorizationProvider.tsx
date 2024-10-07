import React, { useEffect, useState } from 'react';
import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useClosureRef } from '@multiversx/sdk-dapp/hooks/useClosureRef';
import { print } from 'graphql';
import {
  AuthorizationHeadersRequestParamsType,
  SwapGraphQLAddressEnum
} from 'types';
import { AuthorizationContext } from './context';

export const SwapAuthorizationProvider = ({
  getAccessToken,
  getAuthorizationHeaders,
  graphQLAddress,
  children
}: {
  graphQLAddress: SwapGraphQLAddressEnum | string;
  getAccessToken?: () => Promise<string>;
  getAuthorizationHeaders?: (
    requestParams: AuthorizationHeadersRequestParamsType
  ) => Promise<void | null | Record<string, string>>;
  children: React.ReactNode;
}) => {
  const [accessToken, setAccessToken] = useState<string>();

  const onGetAccessToken = async () => {
    let newAccessToken = '';

    try {
      newAccessToken = (await getAccessToken?.()) ?? '';
    } catch (e) {
      console.error(e);
    }
    setAccessToken(newAccessToken);
    return newAccessToken;
  };

  const onGetAccessTokenRef = useClosureRef(onGetAccessToken);
  useEffect(() => {
    //initialize token for isAuthenticated boolean
    onGetAccessTokenRef?.current?.();
  }, []);

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

    const token = await onGetAccessTokenRef.current();

    const authorizationBearerHeader = {
      Authorization: `Bearer ${token}`
    };

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

  const httpLink = from([errorLink, new HttpLink({ uri: graphQLAddress })]);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authMiddleware.concat(httpLink),
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
  });

  return (
    <AuthorizationContext.Provider
      value={{
        isAuthenticated: accessToken != null && accessToken != '',
        isAccessTokenLoading: accessToken == null,
        accessToken,
        client
      }}
    >
      {children}
    </AuthorizationContext.Provider>
  );
};
