import { useEffect, useState } from 'react';
import { SwapRouteType } from 'types';

export const useRateCalculator = ({
  activeRoute
}: {
  activeRoute?: SwapRouteType;
}) => {
  const [rateDirection, setRateDirection] = useState<'normal' | 'reverse'>(
    'normal'
  );

  const [exchangeRate, setExchangeRate] = useState<string>();
  const [tokenInId, setTokenInId] = useState<string>();
  const [tokenInPriceUsd, setTokenInPriceUsd] = useState<string>();
  const [tokenOutId, setTokenOutId] = useState<string>();

  const [reverseExchangeRate, setReverseExchangeRate] = useState<string>();
  const [reverseTokenInId, setReverseTokenInId] = useState<string>();
  const [reverseTokenInPriceUsd, setReverseTokenInPriceUsd] =
    useState<string>();
  const [reverseTokenOutId, setReverseTokenOutId] = useState<string>();

  const calcRate = () => {
    if (!activeRoute) {
      return;
    }

    const {
      tokenInID,
      tokenOutID,
      tokenInPriceUSD,
      tokenOutPriceUSD,
      smartSwap
    } = activeRoute;

    const tokenInExchangeRateDenom =
      smartSwap?.tokenInExchangeRateDenom ??
      activeRoute?.tokenInExchangeRateDenom;

    const tokenOutExchangeRateDenom =
      smartSwap?.tokenOutExchangeRateDenom ??
      activeRoute?.tokenOutExchangeRateDenom;

    setTokenInId(tokenOutID);
    setTokenOutId(tokenInID);
    setExchangeRate(tokenOutExchangeRateDenom);
    setTokenInPriceUsd(tokenOutPriceUSD);

    setReverseTokenInId(tokenInID);
    setReverseTokenOutId(tokenOutID);
    setReverseExchangeRate(tokenInExchangeRateDenom);
    setReverseTokenInPriceUsd(tokenInPriceUSD);
  };

  const switchTokensDirection = () => {
    setRateDirection((existing) =>
      existing === 'normal' ? 'reverse' : 'normal'
    );
  };

  useEffect(calcRate, [activeRoute, rateDirection]);

  return {
    rateDirection,
    tokenInId: rateDirection === 'normal' ? tokenInId : reverseTokenInId,
    tokenInIdPriceUsd:
      rateDirection === 'normal' ? tokenInPriceUsd : reverseTokenInPriceUsd,
    tokenOutId: rateDirection === 'normal' ? tokenOutId : reverseTokenOutId,
    exchangeRate:
      rateDirection === 'normal' ? exchangeRate : reverseExchangeRate,
    switchTokensDirection
  };
};
