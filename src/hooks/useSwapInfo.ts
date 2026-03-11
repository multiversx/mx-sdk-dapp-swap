import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { formatAmount } from 'lib';
import { SwapRouteType, PlatformFeeType, SwapActionTypesEnum } from 'types';
import {
  getPriceImpact,
  TokenRouteType,
  getTokenRoutes,
  PriceImpactType,
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
  const [receivedUsdValue, setReceivedUsdValue] = useState<string>();
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

    const { swapType, smartSwap, amountOut, tokenOutID, tokenOutPriceUSD } =
      activeRoute;

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

    const newPriceImpact = activeRoute?.amountIn
      ? getPriceImpact({
          activeRoute
        })
      : undefined;

    setPlatformFee(
      smartSwap
        ? {
            feeToken: smartSwap.feeToken,
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
  };

  useEffect(handleUpdateStats, [tolerance, activeRoute, swapActionType]);

  return {
    tokenInId,
    tokenOutId,
    tokenRoutes,
    priceImpact,
    platformFee,
    exchangeRate,
    rateDirection,
    receivedUsdValue,
    totalTransactionsFee,
    minimumAmountReceived,
    switchTokensDirection
  };
};
