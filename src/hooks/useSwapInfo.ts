import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { formatAmount } from 'lib';
import {
  SwapRouteType,
  PlatformFeeType,
  SwapFeeDetailsType,
  SwapActionTypesEnum
} from 'types';
import {
  getPriceImpact,
  TokenRouteType,
  getTokenRoutes,
  PriceImpactType,
  getPairFeeDetails,
  getTotalFeesUsdValue,
  calculateMinimumReceived,
  calculateSwapTransactionsFee
} from 'utils';
import { useRateCalculator } from './useRateCalculator';

interface UseSwapInfoProps {
  tolerance: string;
  activeRoute?: SwapRouteType;
  swapActionType?: SwapActionTypesEnum;
}

export const useSwapInfo = ({
  tolerance,
  activeRoute,
  swapActionType
}: UseSwapInfoProps) => {
  const [priceImpact, setPriceImpact] = useState<PriceImpactType>();
  const [platformFee, setPlatformFee] = useState<PlatformFeeType>();
  const [tokenRoutes, setTokenRoutes] = useState<TokenRouteType[]>();
  const [feeDetails, setFeeDetails] = useState<SwapFeeDetailsType>();
  const [receivedUsdValue, setReceivedUsdValue] = useState<string>();
  const [totalFeesUsdValue, setTotalFeesUsdValue] = useState<string>();
  const [minimumAmountReceived, setMinimumAmountReceived] = useState<string>();

  const {
    tokenInId,
    tokenOutId,
    exchangeRate,
    rateDirection,
    switchTokensDirection
  } = useRateCalculator({
    activeRoute
  });

  const totalTransactionsFee = useMemo(
    () => calculateSwapTransactionsFee(activeRoute?.transactions),
    [activeRoute?.transactions]
  );

  const handleUpdateStats = () => {
    if (!activeRoute) {
      return;
    }

    const {
      pairs,
      swapType,
      smartSwap,
      amountOut,
      tokenOutID,
      tokenOutPriceUSD
    } = activeRoute;

    const tokenRoutes = getTokenRoutes({ activeRoute });

    const secondToken = tokenRoutes
      .map(({ tokens }) => tokens)
      .flat()
      .find(({ identifier }) => identifier === tokenOutID);

    const minimumReceived = calculateMinimumReceived({
      tolerance,
      swapActionType,
      isFixedOutput: swapType === 1,
      secondTokenDecimals: secondToken?.decimals,
      secondAmount: smartSwap?.amountOut ?? amountOut
    });

    const newReceivedUsdValue = new BigNumber(
      formatAmount({
        showLastNonZeroDecimal: true,
        decimals: secondToken?.decimals,
        input: smartSwap?.amountOut ?? amountOut
      })
    )
      .times(tokenOutPriceUSD)
      .toString(10);

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

    const newPriceImpact = activeRoute?.amountIn
      ? getPriceImpact({
          activeRoute
        })
      : undefined;

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
    setPriceImpact(newPriceImpact);
    setReceivedUsdValue(newReceivedUsdValue);
    setMinimumAmountReceived(minimumReceived);
    setTotalFeesUsdValue(newTotalFeesUsdValue);
  };

  useEffect(handleUpdateStats, [tolerance, activeRoute, swapActionType]);

  return {
    tokenInId,
    feeDetails,
    tokenOutId,
    tokenRoutes,
    priceImpact,
    platformFee,
    exchangeRate,
    rateDirection,
    receivedUsdValue,
    totalFeesUsdValue,
    totalTransactionsFee,
    minimumAmountReceived,
    switchTokensDirection
  };
};
