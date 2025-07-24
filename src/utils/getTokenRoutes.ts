import { DECIMALS, formatAmount } from 'lib';
import { EsdtType, PairType, SwapRouteType } from 'types';
import { getTokensFromPairs } from './getTokensFromPairs';

export interface TokenRouteType {
  amountIn: string;
  pairs: PairType[];
  amountOut: string;
  tokens: EsdtType[];
}

export const getTokenRoutes = ({
  activeRoute
}: {
  activeRoute: SwapRouteType;
}) => {
  const { smartSwap, tokenRoute, pairs } = activeRoute;

  if (smartSwap) {
    const tokenRoutes: TokenRouteType[] = [];

    smartSwap.routes.forEach((route) => {
      const { intermediaryAmounts, tokenRoute, pairs } = route;

      const tokensReturned = getTokensFromPairs({ pairs, tokenRoute });

      const formattedAmountIn = formatAmount({
        input: intermediaryAmounts[0] ?? '0',
        decimals: tokensReturned[0].decimals,
        showLastNonZeroDecimal: true
      });

      const formattedAmountOut = formatAmount({
        input: intermediaryAmounts[intermediaryAmounts.length - 1] ?? '0',
        decimals: tokensReturned[tokensReturned.length - 1].decimals,
        showLastNonZeroDecimal: true
      });

      tokenRoutes.push({
        pairs,
        tokens: tokensReturned,
        amountIn: formattedAmountIn,
        amountOut: formattedAmountOut
      });
    });

    return tokenRoutes;
  }

  const tokensReturned = getTokensFromPairs({ pairs, tokenRoute });

  const formattedAmountIn = formatAmount({
    input: activeRoute.amountIn,
    showLastNonZeroDecimal: true,
    decimals: tokensReturned.length > 0 ? tokensReturned[0].decimals : DECIMALS // EGLD decimals fallback
  });

  const formattedAmountOut = formatAmount({
    input: activeRoute.amountOut,
    showLastNonZeroDecimal: true,
    decimals:
      tokensReturned.length > 0
        ? tokensReturned[tokensReturned.length - 1]?.decimals
        : DECIMALS // EGLD decimals fallback
  });

  return [
    {
      pairs,
      tokens: tokensReturned,
      amountIn: formattedAmountIn,
      amountOut: formattedAmountOut
    }
  ] as TokenRouteType[];
};
