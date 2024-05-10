import { useMemo, useState } from 'react';
import { useAuthorizationContext } from 'components/SwapAuthorizationProvider';
import { GET_TOKENS, GET_TOKENS_AND_BALANCE, TokensType } from 'queries';
import { EsdtType, FactoryType, TokenTypesEnum, UserEsdtType } from 'types';
import { getSortedTokensByUsdValue } from 'utils';
import { useLazyQueryWrapper } from './useLazyQueryWrapper';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 500;
const DEFAULT_ENABLED_SWAPS = true;
const DEFAULT_ONLY_SAFE_TOKENS = true;
const DEFAULT_IDENTIFIERS: string[] = [];

const safeTokenTypes = [
  TokenTypesEnum.core,
  TokenTypesEnum.ecosystem,
  TokenTypesEnum.community
];

interface GetTokensType {
  limit?: number;
  offset?: number;
  identifiers?: string[];
  enabledSwaps?: boolean;
  onlySafeTokens?: boolean;
}

interface UseTokensType {
  onlySafeTokens?: boolean;
}

export const useTokens = (options?: UseTokensType) => {
  const { client } = useAuthorizationContext();

  if (!client) {
    throw new Error('Swap GraphQL client not initialized');
  }

  const [tokens, setTokens] = useState<UserEsdtType[]>([]);
  const [wrappedEgld, setWrappedEgld] = useState<EsdtType>();
  const [swapConfig, setSwapConfig] = useState<FactoryType>();
  const { isAuthenticated, isAccessTokenLoading } = useAuthorizationContext();

  const sortedTokensByUsdValue = useMemo(
    () => getSortedTokensByUsdValue({ tokens, wrappedEgld }),
    [tokens, wrappedEgld]
  );

  const onlySafeTokens = options?.onlySafeTokens ?? DEFAULT_ONLY_SAFE_TOKENS;

  const handleOnCompleted = (data?: TokensType | null) => {
    if (!data) {
      return;
    }

    const { tokens: swapTokens, wrappingInfo, userTokens, factory } = data;

    if (factory) {
      setSwapConfig(factory);
    }

    if (wrappingInfo && wrappingInfo.length) {
      setWrappedEgld(wrappingInfo[0].wrappedToken);
    }

    if (!swapTokens) {
      setTokens([]);
      return;
    }

    const newTokens: UserEsdtType[] = swapTokens.map((token) => {
      const tokenFound = userTokens?.find(
        ({ identifier }) => identifier === token.identifier
      );

      return {
        ...token,
        balance: tokenFound?.balance ?? '0',
        valueUSD: tokenFound?.valueUSD ?? '0'
      };
    });

    if (onlySafeTokens) {
      const safeTokens = newTokens.filter(
        ({ type }) =>
          type && type !== 'FungibleESDT-LP' && safeTokenTypes.includes(type)
      );

      setTokens(safeTokens);
      return;
    }

    setTokens(newTokens);
  };

  const {
    execute: getTokensTrigger,
    isLoading,
    isError
  } = useLazyQueryWrapper<TokensType>({
    query: isAuthenticated ? GET_TOKENS_AND_BALANCE : GET_TOKENS,
    queryOptions: {
      client,
      onCompleted: handleOnCompleted
    }
  });

  const getTokens = (options?: GetTokensType) => {
    if (isAccessTokenLoading) {
      return;
    }

    const { limit, offset, identifiers, enabledSwaps } = {
      limit: options?.limit ?? DEFAULT_LIMIT,
      offset: options?.offset ?? DEFAULT_OFFSET,
      identifiers: options?.identifiers ?? DEFAULT_IDENTIFIERS,
      enabledSwaps: options?.enabledSwaps ?? DEFAULT_ENABLED_SWAPS
    };

    getTokensTrigger({
      variables: {
        identifiers,
        offset,
        limit,
        enabledSwaps
      }
    });
  };

  return {
    tokens: sortedTokensByUsdValue,
    swapConfig,
    wrappedEgld,
    isTokensError: isError,
    isTokensLoading: isLoading,
    refetch: getTokensTrigger,
    getTokens
  };
};
