import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuthorizationContext } from 'components/SwapAuthorizationProvider';
import {
  GET_FILTERED_TOKENS,
  FilteredTokensQueryType,
  GET_FILTERED_TOKENS_AND_BALANCE
} from 'queries';
import {
  EsdtType,
  FactoryType,
  UserEsdtType,
  TokensPaginationType
} from 'types';
import { getSortedTokensByUsdValue, mergeTokens } from 'utils';
import { useIntersectionObserver } from './useIntersectionObserver';
import { useLazyQueryWrapper } from './useLazyQueryWrapper';
import { useTokenMetadataSubscription } from './useTokenMetadataSubscription';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 1000;
const DEFAULT_SEARCH_INPUT = '';
const DEFAULT_ENABLED_SWAPS = true;
const DEFAULT_IDENTIFIERS: string[] = [];
const DEFAULT_PAGINATION: TokensPaginationType = { first: 20, after: '' };

interface GetTokensType {
  limit?: number;
  offset?: number;
  searchInput?: string;
  identifiers?: string[];
  enabledSwaps?: boolean;
  pagination?: TokensPaginationType;
}

interface UseTokensType {
  observerId?: string;
  searchInput?: string;
  identifiers?: string[];
}

export const useFilteredTokens = (options?: UseTokensType) => {
  const isInitialLoad = useRef(true);
  const { client, isAuthenticated } = useAuthorizationContext();

  if (!client) {
    throw new Error('Swap GraphQL client not initialized');
  }

  const searchInput = options?.searchInput;

  const [pagination, setPagination] = useState<TokensPaginationType>({
    first: 20,
    after: ''
  });
  const [hasMore, setHasMore] = useState(true);
  const [currentCursor, setCurrentCursor] = useState<string>();
  const [loadedCursors, setLoadedCursors] = useState<Set<string>>(new Set());

  const [tokens, setTokens] = useState<UserEsdtType[]>([]);
  const [wrappedEgld, setWrappedEgld] = useState<EsdtType>();
  const [swapConfig, setSwapConfig] = useState<FactoryType>();
  const [tokensCount, setTokensCount] = useState<number>();
  let ignoreNextHasMore = false;

  const { subscriptionPrices, subscriptionData } =
    useTokenMetadataSubscription();

  const handleOnCompleted = (data?: FilteredTokensQueryType | null) => {
    if (!data) return;

    const { wrappingInfo, userTokens, factory, filteredTokens } = data;
    const { edges, pageInfo, pageData } = filteredTokens;

    setTokensCount(pageData?.count);
    if (factory) setSwapConfig(factory);

    const newWrappedEgld =
      wrappingInfo && wrappingInfo.length
        ? wrappingInfo[0].wrappedToken
        : undefined;
    setWrappedEgld(newWrappedEgld);

    if (!edges) return;

    setCurrentCursor(edges[edges.length - 1]?.cursor);
    const tokensWithBalance: UserEsdtType[] = edges.map((token) => ({
      ...token.node,
      balance: '0',
      valueUSD: '0'
    }));

    const mergedTokens = mergeTokens(tokensWithBalance, userTokens);
    const sortedTokensWithBalance = getSortedTokensByUsdValue({
      tokens: mergedTokens,
      wrappedEgld: newWrappedEgld
    });

    setTokens((prevTokens) => mergeTokens(prevTokens, sortedTokensWithBalance));

    if (!pageInfo?.hasNextPage && !ignoreNextHasMore) {
      setHasMore(false);
    } else {
      ignoreNextHasMore = false;
    }
  };

  const {
    isError,
    isLoading,
    execute: getTokensTrigger
  } = useLazyQueryWrapper<FilteredTokensQueryType>({
    query: isAuthenticated
      ? GET_FILTERED_TOKENS_AND_BALANCE
      : GET_FILTERED_TOKENS,
    queryOptions: {
      client,
      onCompleted: handleOnCompleted
    }
  });

  const getTokens = (options?: GetTokensType, continueFetching?: boolean) => {
    const variables = {
      limit: options?.limit ?? DEFAULT_LIMIT,
      offset: options?.offset ?? DEFAULT_OFFSET,
      identifiers: options?.identifiers ?? DEFAULT_IDENTIFIERS,
      enabledSwaps: options?.enabledSwaps ?? DEFAULT_ENABLED_SWAPS,
      pagination: options?.pagination ?? DEFAULT_PAGINATION,
      searchInput: options?.searchInput ?? DEFAULT_SEARCH_INPUT
    };

    getTokensTrigger({
      variables
    });

    if (continueFetching) {
      ignoreNextHasMore = true;
    }
  };

  const updateWEGLDPrice = () => {
    if (subscriptionData?.tokenMetadataChanged) {
      const { identifier, price } = subscriptionData.tokenMetadataChanged;

      if (wrappedEgld && wrappedEgld.identifier === identifier) {
        setWrappedEgld((prev) => (prev ? { ...prev, price } : prev));
      }
    }
  };

  useEffect(updateWEGLDPrice, [subscriptionData]);

  const tokensWithUpdatedPrice = useMemo(
    () =>
      tokens.map((token) => {
        const subscriptionPrice = subscriptionPrices[token.identifier];

        return {
          ...token,
          price: subscriptionPrice ?? token.price
        };
      }),
    [tokens, subscriptionPrices]
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    setPagination({ first: 20, after: '' });
    setLoadedCursors(new Set());
    setHasMore(true);
    getTokens({ pagination: { first: 20, after: '' }, searchInput });
  }, [searchInput]);

  useEffect(() => {
    if (pagination.after) {
      setLoadedCursors((prev) => new Set(prev).add(pagination.after as string));
      getTokens({ pagination, searchInput });
    }
  }, [pagination]);

  useIntersectionObserver({
    tokens,
    hasMore,
    loadedCursors,
    isLoading: isLoading ?? false,
    currentCursor: currentCursor ?? '',
    observerId: options?.observerId ?? '',
    setPagination
  });

  return {
    swapConfig,
    wrappedEgld,
    isTokensError: isError,
    isTokensLoading: isLoading,
    totalTokensCount: tokensCount,
    tokens: tokensWithUpdatedPrice,
    getTokens,
    refetch: getTokensTrigger
  };
};
