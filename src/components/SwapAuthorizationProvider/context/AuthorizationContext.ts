import { createContext, useContext } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export type AuthorizationContextType = {
  isAuthenticated?: boolean;
  accessToken?: string;
  isAccessTokenLoading: boolean;
  client?: ApolloClient<NormalizedCacheObject>;
};

export const AuthorizationContext = createContext<AuthorizationContextType>({
  isAuthenticated: false,
  accessToken: '',
  isAccessTokenLoading: true
});

export const useAuthorizationContext = () => {
  const context = useContext(AuthorizationContext);
  if (context == null) {
    throw new Error(
      'useAuthorizationContext must be used within a AuthorizationProvider'
    );
  }
  return context;
};
