import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  SwapRouteType,
  PlatformFeeType,
  SelectOptionType,
  SwapFeeDetailsType,
  SwapActionTypesEnum
} from 'types';
import {
  removeCommas,
  TokenRouteType,
  getTokenRoutes,
  PriceImpactType,
  getPriceImpacts,
  getPairFeeDetails,
  getTotalFeesUsdValue,
  calculateMinimumReceived,
  calculateSwapTransactionsFee
} from 'utils';
import { useRateCalculator } from './useRateCalculator';

interface UseSwapInfoProps {
  tolerance: string;
  activeRoute?: SwapRouteType;
  firstToken?: SelectOptionType;
  secondToken?: SelectOptionType;
  swapActionType?: SwapActionTypesEnum;
}

export const useSwapInfo = ({
  tolerance,
  activeRoute,
  firstToken,
  secondToken,
  swapActionType
}: UseSwapInfoProps) => {
  const [tokenRoutes, setTokenRoutes] = useState<TokenRouteType[]>();
  const [minimumAmountReceived, setMinimumAmountReceived] = useState<string>();
  const [priceImpacts, setPriceImpacts] = useState<PriceImpactType[]>();
  const [feeDetails, setFeeDetails] = useState<SwapFeeDetailsType>();
  const [platformFee, setPlatformFee] = useState<PlatformFeeType>();
  const [totalFeesUsdValue, setTotalFeesUsdValue] = useState<string>();

  const {
    tokenInId,
    direction,
    tokenOutId,
    exchangeRate,
    switchTokensDirection
  } = useRateCalculator({
    activeRoute
  });

  const totalTransactionsFee = useMemo(
    () => calculateSwapTransactionsFee(activeRoute?.transactions),
    [activeRoute?.transactions]
  );

  const cleanExchangeRate = removeCommas(exchangeRate || '');
  const cleanFirstTokenPrice = removeCommas(firstToken?.token?.price ?? '');
  const cleanSecondTokenPrice = removeCommas(secondToken?.token?.price ?? '');

  const tokenPrice =
    tokenInId === firstToken?.value
      ? cleanSecondTokenPrice
      : cleanFirstTokenPrice;

  const exchangeRateUsdValue = new BigNumber(cleanExchangeRate || '0')
    .multipliedBy(tokenPrice || '0')
    .toString(10);

  const handleUpdateStats = () => {
    if (!activeRoute) {
      return;
    }

    const { swapType, pairs, smartSwap, amountOut } = activeRoute;

    const minimumReceived = calculateMinimumReceived({
      tolerance,
      secondAmount: smartSwap?.amountOut ?? amountOut,
      secondTokenDecimals:
        direction === 'normal'
          ? secondToken?.token.decimals
          : firstToken?.token.decimals,
      isFixedOutput: swapType === 1,
      swapActionType
    });

    pairs.forEach((pair) => {
      const { totalFee, burn, lpHolders } = getPairFeeDetails(pair);

      const newFeeTooltip = {
        totalFee,
        burn,
        lpHolders
      };

      setFeeDetails(newFeeTooltip);
      return;
    });

    const newPriceImpacts = activeRoute?.amountIn
      ? getPriceImpacts({
          activeRoute
        })
      : undefined;

    const tokenRoutes = getTokenRoutes({ activeRoute });

    const newTotalFeesUsdValue = activeRoute?.amountIn
      ? getTotalFeesUsdValue({
          activeRoute
        })
      : undefined;

    setPlatformFee(
      smartSwap
        ? {
            feeAmount: smartSwap.feeAmount,
            feePercentage: new BigNumber(smartSwap.feePercentage)
              .times(100)
              .toNumber()
          }
        : undefined
    );

    setTokenRoutes(tokenRoutes);
    setMinimumAmountReceived(minimumReceived);
    setPriceImpacts(newPriceImpacts);
    setTotalFeesUsdValue(newTotalFeesUsdValue);
  };

  useEffect(handleUpdateStats, [
    tolerance,
    firstToken,
    activeRoute,
    secondToken,
    swapActionType
  ]);

  return {
    tokenInId,
    feeDetails,
    tokenOutId,
    tokenRoutes,
    platformFee,
    priceImpacts,
    exchangeRate,
    totalFeesUsdValue,
    exchangeRateUsdValue,
    totalTransactionsFee,
    minimumAmountReceived,
    switchTokensDirection
  };
};
