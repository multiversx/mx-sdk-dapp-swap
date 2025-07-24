import BigNumber from 'bignumber.js';
import { PriceImpactLevelEnum, SwapRouteType } from 'types';

export interface PriceImpactType {
  priceImpactPercentage?: number;
  priceImpactLevel?: PriceImpactLevelEnum;
}

export const getPriceImpact = ({
  activeRoute
}: {
  activeRoute?: SwapRouteType;
}) => {
  if (!activeRoute) return;

  const { smartSwap, tokensPriceDeviationPercent } = activeRoute;

  const priceImpactPercentage =
    smartSwap?.tokensPriceDeviationPercent ?? tokensPriceDeviationPercent;

  const bnPriceImpactPercentage = new BigNumber(priceImpactPercentage ?? 0);

  const priceImpactLevel = bnPriceImpactPercentage.isLessThan(5)
    ? PriceImpactLevelEnum.normal
    : bnPriceImpactPercentage.isLessThan(10)
    ? PriceImpactLevelEnum.high
    : PriceImpactLevelEnum.veryHigh;

  return {
    priceImpactLevel,
    priceImpactPercentage
  };
};
