import { formatAmount } from 'lib';
import { EsdtType, SwapRouteType } from 'types';
import { getTokensFromPairs } from './getTokensFromPairs';

export interface TokenRouteType {
  tokens: EsdtType[];
  amountIn: string;
  amountOut: string;
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
        tokens: tokensReturned,
        amountIn: formattedAmountIn,
        amountOut: formattedAmountOut
      });
    });

    return tokenRoutes;
  }

  const tokensReturned = getTokensFromPairs({ pairs, tokenRoute });

  const formattedAmountIn = formatAmount({
    input: activeRoute.amountIn ?? '0',
    decimals: tokensReturned[0].decimals,
    showLastNonZeroDecimal: true
  });

  const formattedAmountOut = formatAmount({
    input: activeRoute.amountOut ?? '0',
    decimals: tokensReturned[tokensReturned.length - 1].decimals,
    showLastNonZeroDecimal: true
  });

  return [
    {
      tokens: tokensReturned,
      amountIn: formattedAmountIn,
      amountOut: formattedAmountOut
    }
  ] as TokenRouteType[];
};
