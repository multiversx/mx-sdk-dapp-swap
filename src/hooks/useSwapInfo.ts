import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  SelectOptionType,
  SwapRouteType,
  SwapFeeDetailsType,
  SwapActionTypesEnum
} from 'types';
import {
  getPairFeeDetails,
  calculateMinimumReceived,
  removeCommas,
  calculateSwapTransactionsFee,
  getTotalFeesUsdValue,
  getPriceImpacts,
  PriceImpactType,
  getTokenRoutes,
  TokenRouteType
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
  const [totalFeesUsdValue, setTotalFeesUsdValue] = useState<string>();

  const { tokenInId, tokenOutId, exchangeRate, switchTokensDirection } =
    useRateCalculator({
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
      secondTokenDecimals: secondToken?.token.decimals,
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

    setTokenRoutes(tokenRoutes);
    setMinimumAmountReceived(minimumReceived);
    setPriceImpacts(newPriceImpacts);
    setTotalFeesUsdValue(newTotalFeesUsdValue);
  };

  useEffect(handleUpdateStats, [
    tolerance,
    activeRoute,
    firstToken,
    secondToken,
    swapActionType
  ]);

  return {
    exchangeRate,
    feeDetails,
    priceImpacts,
    tokenInId,
    tokenOutId,
    totalFeesUsdValue,
    tokenRoutes,
    switchTokensDirection,
    totalTransactionsFee,
    minimumAmountReceived,
    exchangeRateUsdValue
  };
};
