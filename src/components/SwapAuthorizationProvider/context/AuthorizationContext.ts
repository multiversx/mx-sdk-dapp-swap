import { createContext, useContext } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export type AuthorizationContextType = {
  accessToken?: string;
  isAuthenticated?: boolean;
  client?: ApolloClient<NormalizedCacheObject>;
};

export const AuthorizationContext = createContext<AuthorizationContextType>({
  accessToken: '',
  isAuthenticated: false
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
