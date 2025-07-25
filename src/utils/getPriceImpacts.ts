import { PairType, SwapRouteType } from 'types';

export interface PriceImpactsType {
  pair: PairType;
  priceImpactPercentage: string;
}

export const getPriceImpacts = ({
  activeRoute
}: {
  activeRoute: SwapRouteType;
}) => {
  const { pricesImpact, smartSwap, pairs } = activeRoute;

  if (smartSwap) {
    const impactsPerRoute: PriceImpactsType[] = [];

    smartSwap.routes.forEach((route, i) => {
      const { pairs, pricesImpact } = route;

      const impactPerPair = pairs.map((pair, i) => {
        return {
          pair,
          priceImpactPercentage: pricesImpact[i]
        };
      });

      impactsPerRoute.push(...impactPerPair);
    });

    return impactsPerRoute;
  }

  return pairs.map((pair, i) => {
    return {
      pair,
      priceImpactPercentage: pricesImpact[i]
    };
  });
};
