import { parseAmount } from '@multiversx/sdk-dapp/utils';
import { FIXED_INPUT } from 'constants/general';
import { SwapRouteType, UserEsdtType } from 'types';
import { meaningfulFormatAmount } from './meaningfulFormatAmount';

export const getCorrectAmountsOnTokenChange = ({
  activeRoute,
  newTokenOption,
  currentTokenOption
}: {
  activeRoute?: SwapRouteType;
  newTokenOption?: UserEsdtType;
  currentTokenOption?: UserEsdtType;
}) => {
  if (!activeRoute || !newTokenOption || !currentTokenOption)
    return {
      amountIn: undefined,
      amountOut: undefined
    };

  const isFixedInput = activeRoute?.swapType === FIXED_INPUT;
  const initialParsedAmount = isFixedInput
    ? activeRoute?.amountIn
    : activeRoute?.amountOut;

  // format initial amount with the initial decimals
  // and preserve precision in case it was a max button amount
  const formattedInitialParsedAmount = meaningfulFormatAmount({
    amount: initialParsedAmount,
    showLastNonZeroDecimal: true,
    decimals: currentTokenOption.decimals
  });

  // parse the precise old amount with the new decimals
  const parsedNewAmount = parseAmount(
    formattedInitialParsedAmount,
    newTokenOption?.decimals
  );

  const amountIn = isFixedInput ? parsedNewAmount : undefined;
  const amountOut = isFixedInput ? undefined : parsedNewAmount;

  return {
    amountIn,
    amountOut
  };
};
