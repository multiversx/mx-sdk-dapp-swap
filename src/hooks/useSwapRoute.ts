import { useEffect, useMemo, useRef, useState } from 'react';
import { OperationVariables } from '@apollo/client';
import { RawTransactionType } from '@multiversx/sdk-dapp/types/transactions.types';
import { useAuthorizationContext } from 'components/SwapAuthorizationProvider';
import { FIXED_INPUT, FIXED_OUTPUT } from 'constants/general';
import {
  swapQuery,
  wrapEgldQuery,
  unwrapEgldQuery,
  SwapRouteQueryResponseType,
  swapWithoutTransactionsQuery
} from 'queries';
import {
  EsdtType,
  SwapRouteType,
  SwapActionTypesEnum,
  WrappingQueryResponseType
} from 'types';
import { translateSwapError, getSwapActionType } from 'utils';
import { useQueryWrapper } from './useQueryWrapper';

export interface GetSwapRouteType {
  amountIn?: string;
  amountOut?: string;
  tokenInID: string;
  tokenOutID: string;
  wrappingAmount?: string; // used only by wrapping queries
  tolerancePercentage?: number;
}

export interface GetSwapRouteVariablesType
  extends Omit<GetSwapRouteType, 'tolerancePercentage'> {
  tolerance?: number;
}

export interface UseSwapRouteType {
  isSwapRouteError?: boolean;
  swapRouteError?: string;
  isAmountInLoading: boolean;
  getSwapRoute: (props: GetSwapRouteType) => void;
  swapRoute?: SwapRouteType;
  previousFetchVariables: React.MutableRefObject<
    GetSwapRouteVariablesType | undefined
  >;
  refetch: (variables?: Partial<OperationVariables>) => void;
  transactions?: RawTransactionType[];
  isSwapRouteLoading: boolean;
  isAmountOutLoading: boolean;
  swapActionType?: SwapActionTypesEnum;
}

export const useSwapRoute = ({
  wrappedEgld,
  isPollingEnabled = false
}: {
  wrappedEgld?: EsdtType;
  isPollingEnabled?: boolean;
}): UseSwapRouteType => {
  const { client, isAuthenticated } = useAuthorizationContext();

  if (!client) {
    throw new Error('Swap GraphQL client not initialized');
  }

  const [variables, setVariables] = useState<GetSwapRouteType>();
  const [swapRoute, setSwapRoute] = useState<SwapRouteType>();
  const [swapRouteError, setSwapRouteError] = useState<string>();

  const previousFetchVariablesRef = useRef<GetSwapRouteVariablesType>();

  const swapActionType = useMemo(
    () =>
      getSwapActionType({
        firstTokenId: variables?.tokenInID,
        secondTokenId: variables?.tokenOutID,
        wrappedEgld
      }),
    [variables, wrappedEgld]
  );

  const handleOnCompleted = (
    data?: SwapRouteQueryResponseType | WrappingQueryResponseType
  ) => {
    if (!variables || !data) {
      setSwapRoute(undefined);
      setSwapRouteError(undefined);
      return;
    }

    switch (swapActionType) {
      case SwapActionTypesEnum.wrap:
      case SwapActionTypesEnum.unwrap:
        const { wrapEgld, unwrapEgld } = data as WrappingQueryResponseType;

        const transaction = wrapEgld ?? unwrapEgld;
        const swapType = variables.amountIn ? FIXED_INPUT : FIXED_OUTPUT;
        const amount = variables.amountIn ?? variables.amountOut;

        const wrappingSwapRoute: SwapRouteType = {
          amountIn: amount ?? '0',
          tokenInID: variables.tokenInID,
          tokenInPriceUSD: wrappedEgld?.price ?? '0',
          tokenInExchangeRateDenom: '1',
          maxPriceDeviationPercent: 0,
          tokensPriceDeviationPercent: 0,

          amountOut: amount ?? '0',
          tokenOutID: variables.tokenOutID,
          tokenOutPriceUSD: wrappedEgld?.price ?? '0',
          tokenOutExchangeRateDenom: '1',

          fees: [],
          swapType,
          tokenRoute: [],
          pricesImpact: [],

          intermediaryAmounts: [],
          pairs: [],
          transactions: transaction ? [transaction] : []
        };

        setSwapRoute(wrappingSwapRoute);
        setSwapRouteError(undefined);
        break;
      default:
        const { swap, errors } = data as SwapRouteQueryResponseType;

        const error = errors
          ? translateSwapError(errors[0].message)
          : undefined;

        setSwapRoute(swap);
        setSwapRouteError(error);
    }
  };

  const query = useMemo(() => {
    if (swapActionType === SwapActionTypesEnum.wrap) return wrapEgldQuery;
    if (swapActionType === SwapActionTypesEnum.unwrap) return unwrapEgldQuery;

    return isAuthenticated ? swapQuery : swapWithoutTransactionsQuery;
  }, [isAuthenticated, swapActionType]);

  const skip = useMemo(() => {
    if (!variables) return true;

    const { amountIn, amountOut } = variables;
    const hasAmount = Boolean(amountIn ?? amountOut);

    if (!hasAmount) return true;

    return false;
  }, [variables]);

  const { data, refetch, isRefetching, isLoading, isError } = useQueryWrapper<
    SwapRouteQueryResponseType | WrappingQueryResponseType
  >({
    query,
    queryOptions: {
      skip,
      client,
      variables
    },
    isPollingEnabled
  });

  const getSwapRoute = ({
    amountIn,
    amountOut,
    tokenInID,
    tokenOutID,
    tolerancePercentage = 1
  }: GetSwapRouteType) => {
    const guardedTolerancePercentage =
      tolerancePercentage < 0 || tolerancePercentage > 100
        ? 1
        : tolerancePercentage;

    const variables: GetSwapRouteVariablesType = {
      wrappingAmount: amountIn ?? amountOut,
      amountIn,
      amountOut,
      tokenInID,
      tokenOutID,
      tolerance: guardedTolerancePercentage / 100
    };

    setVariables(variables);
    previousFetchVariablesRef.current = variables;
  };

  useEffect(() => handleOnCompleted(data), [data]);

  const isAmountOutLoading = Boolean(
    (isLoading || isRefetching) && previousFetchVariablesRef.current?.amountIn
  );

  const isAmountInLoading = Boolean(
    (isLoading || isRefetching) && previousFetchVariablesRef.current?.amountOut
  );

  return {
    refetch,
    getSwapRoute,
    swapRoute,
    swapActionType,
    swapRouteError,
    isAmountInLoading,
    isAmountOutLoading,
    isSwapRouteError: isError,
    isSwapRouteLoading: isLoading,
    transactions: swapRoute?.transactions,
    previousFetchVariables: previousFetchVariablesRef
  };
};
