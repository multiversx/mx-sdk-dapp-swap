import BigNumber from 'bignumber.js';
import { SwapRouteType } from 'types';

export const getPriceDeviationDetails = ({
  activeRoute
}: {
  activeRoute: SwapRouteType;
}) => {
  const {
    smartSwap,
    pairs,
    maxPriceDeviationPercent,
    tokensPriceDeviationPercent
  } = activeRoute;

  const deviation =
    smartSwap?.tokensPriceDeviationPercent ?? tokensPriceDeviationPercent;

  const isDirectSwap = !smartSwap && pairs.length === 1;
  const isAboveMaxDeviation = new BigNumber(deviation).isGreaterThan(
    maxPriceDeviationPercent
  );

  const canShowDeviationWarning = Boolean(isDirectSwap && isAboveMaxDeviation);

  return {
    canShowDeviationWarning,
    priceDeviationPercentage: new BigNumber(deviation).times(100).toString(10)
  };
};
