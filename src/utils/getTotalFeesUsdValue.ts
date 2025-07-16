import { BigNumber } from 'bignumber.js';
import { EsdtType, SwapRouteType } from 'types';
import { getTokensFromPairs } from './getTokensFromPairs';

const getFeeUsdValue = (
  tokenRoute: string[],
  tokens: EsdtType[],
  fees: string[]
) => {
  let bnTotalFeesUsdValue = new BigNumber(0);

  tokenRoute?.forEach((el, i, arr) => {
    if (i === arr.length - 1) return;

    const token = tokens.find(({ identifier }) => identifier === el);

    if (!token) return;

    const bnFeeUsdValue = new BigNumber(fees[i]).multipliedBy(
      token.price ?? '0'
    );
    bnTotalFeesUsdValue = bnTotalFeesUsdValue.plus(bnFeeUsdValue);
  });

  return bnTotalFeesUsdValue.toString(10);
};

export const getTotalFeesUsdValue = ({
  activeRoute
}: {
  activeRoute: SwapRouteType;
}) => {
  const { fees, tokenRoute, smartSwap, pairs } = activeRoute;

  if (smartSwap) {
    let bnTotalFeesUsdValue = new BigNumber(0);

    smartSwap.routes.forEach((route) => {
      const { tokenRoute, fees, pairs } = route;

      const tokens = getTokensFromPairs({ pairs, tokenRoute });

      const feeUsdValue = getFeeUsdValue(tokenRoute, tokens, fees);
      bnTotalFeesUsdValue = bnTotalFeesUsdValue.plus(feeUsdValue);
    });

    return bnTotalFeesUsdValue.toString(10);
  }

  const tokens = getTokensFromPairs({ pairs, tokenRoute });

  return getFeeUsdValue(tokenRoute, tokens, fees);
};
