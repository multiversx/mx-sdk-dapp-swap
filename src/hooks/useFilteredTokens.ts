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
import { useTokenPriceSubscription } from './useTokenPriceSubscription';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 1000;
const DEFAULT_SEARCH_INPUT = '';
const DEFAULT_ENABLED_SWAPS = true;
const DEFAULT_IDENTIFIERS: string[] = [];

interface GetTokensType {
  searchInput?: string;
  identifiers?: string[];
  enabledSwaps?: boolean;
  pagination?: TokensPaginationType;
}

interface UseFilteredTokensType {
  observerId?: string;
  searchInput?: string;
  identifiers?: string[];
  enableProgressiveFetching?: boolean;
}

export const useFilteredTokens = (
  filteredTokensParams?: UseFilteredTokensType
) => {
  const isInitialLoad = useRef(true);
  const enableProgressiveFetching =
    filteredTokensParams?.enableProgressiveFetching ?? true;
  const { client, isAuthenticated } = useAuthorizationContext();

  const DEFAULT_PAGE_SIZE = useMemo(
    () => (enableProgressiveFetching ? 20 : 60),
    [enableProgressiveFetching]
  );

  if (!client) {
    throw new Error('Swap GraphQL client not initialized');
  }

  const searchInput = filteredTokensParams?.searchInput;

  const [pagination, setPagination] = useState<TokensPaginationType>({
    first: DEFAULT_PAGE_SIZE,
    after: ''
  });
  const [hasMore, setHasMore] = useState(true);
  const [currentCursor, setCurrentCursor] = useState<string>();
  const [loadedCursors, setLoadedCursors] = useState<Set<string>>(new Set());

  const [tokens, setTokens] = useState<UserEsdtType[]>([]);
  const [wrappedEgld, setWrappedEgld] = useState<EsdtType>();
  const [swapConfig, setSwapConfig] = useState<FactoryType>();
  const [tokensCount, setTokensCount] = useState<number>();

  const { priceSubscriptions } = useTokenPriceSubscription();

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

    if (newWrappedEgld) {
      setWrappedEgld(newWrappedEgld);
    }

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
    setHasMore(
      enableProgressiveFetching && pageInfo?.hasNextPage ? true : false
    );
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

  const getTokens = (options?: GetTokensType) => {
    const variables = {
      userTokensLimit: DEFAULT_LIMIT,
      userTokensOffset: DEFAULT_OFFSET,
      identifiers: options?.identifiers ?? DEFAULT_IDENTIFIERS,
      enabledSwaps: options?.enabledSwaps ?? DEFAULT_ENABLED_SWAPS,
      pagination: options?.pagination ?? {
        first: DEFAULT_PAGE_SIZE,
        after: ''
      },
      searchInput: options?.searchInput ?? DEFAULT_SEARCH_INPUT
    };

    getTokensTrigger({
      variables
    });
  };

  const updateWEGLDPrice = () => {
    if (priceSubscriptions) {
      const priceUpdateForWegld = wrappedEgld?.identifier
        ? priceSubscriptions[wrappedEgld?.identifier]
        : undefined;

      // update price only if it is outdated
      if (wrappedEgld && priceUpdateForWegld) {
        setWrappedEgld({
          ...wrappedEgld,
          price: priceUpdateForWegld.price
        });
      }
    }
  };

  useEffect(updateWEGLDPrice, [priceSubscriptions]);

  const tokensWithUpdatedPrice = useMemo(() => {
    const keys = Object.keys(priceSubscriptions);

    // we update prices only if the tokens are fetched
    if (tokens.some(({ identifier }) => keys.includes(identifier))) {
      return tokens.map((token) => {
        const subscriptionPrice = priceSubscriptions[token.identifier];

        return {
          ...token,
          price: subscriptionPrice?.price ?? token.price
        };
      });
    }

    return tokens;
  }, [tokens, priceSubscriptions]);

  const onSearchInputChange = () => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    setPagination({
      first: DEFAULT_PAGE_SIZE,
      after: ''
    });
    setLoadedCursors(new Set());
    setHasMore(true);
    getTokens({
      pagination: {
        first: DEFAULT_PAGE_SIZE,
        after: ''
      },
      searchInput
    });
  };

  const onPaginationChange = () => {
    if (pagination.after) {
      setLoadedCursors((prev) => new Set(prev).add(pagination.after as string));
      getTokens({ pagination, searchInput });
    }
  };

  useEffect(onSearchInputChange, [searchInput]);
  useEffect(onPaginationChange, [pagination]);

  useIntersectionObserver({
    tokens,
    hasMore,
    loadedCursors,
    pageSize: DEFAULT_PAGE_SIZE,
    isLoading: isLoading ?? false,
    currentCursor: currentCursor ?? '',
    observerId: filteredTokensParams?.observerId ?? '',
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
