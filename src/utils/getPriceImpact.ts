import BigNumber from 'bignumber.js';
import { PriceImpactLevelEnum, SwapRouteType } from 'types';

export interface PriceImpactType {
  priceImpactPercentage?: string;
  priceImpactLevel?: PriceImpactLevelEnum;
}

export const getPriceImpact = ({
  activeRoute
}: {
  activeRoute?: SwapRouteType;
}) => {
  if (!activeRoute) return;

  const {
    pairs,
    smartSwap,
    maxPriceDeviationPercent,
    tokensPriceDeviationPercent
  } = activeRoute;

  const isDirectSwap = !smartSwap && pairs.length === 1;
  const bnPriceImpactPercentage = new BigNumber(
    smartSwap?.tokensPriceDeviationPercent ?? tokensPriceDeviationPercent ?? 0
  );

  const bnMaxPriceDeviationPercent = new BigNumber(maxPriceDeviationPercent);

  const isAboveMaxDeviation = bnPriceImpactPercentage.isGreaterThan(
    maxPriceDeviationPercent
  );

  const canShowPriceImpactWarning = Boolean(
    isDirectSwap && isAboveMaxDeviation
  );

  const bnNormalLevelPercentage = bnMaxPriceDeviationPercent
    .times(100)
    .times(0.33)
    .dividedBy(100);

  const bnHighLevelPercentage = bnMaxPriceDeviationPercent
    .times(100)
    .times(0.66)
    .dividedBy(100);

  const priceImpactLevel = bnPriceImpactPercentage.isLessThan(
    bnNormalLevelPercentage
  )
    ? PriceImpactLevelEnum.normal
    : bnPriceImpactPercentage.isLessThan(bnHighLevelPercentage)
    ? PriceImpactLevelEnum.high
    : PriceImpactLevelEnum.veryHigh;

  return {
    priceImpactLevel,
    canShowPriceImpactWarning,
    priceImpactPercentage: bnPriceImpactPercentage.times(100).toString(10)
  };
};
