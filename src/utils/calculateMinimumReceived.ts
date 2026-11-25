import BigNumber from 'bignumber.js';
import { formatAmount } from 'lib';
import { SwapActionTypesEnum } from 'types';

export const calculateMinimumReceived = ({
  tolerance,
  secondAmount,
  isFixedOutput,
  swapActionType,
  secondTokenDecimals
}: {
  tolerance: string;
  secondAmount?: string;
  isFixedOutput: boolean;
  swapActionType?: SwapActionTypesEnum;
  secondTokenDecimals?: number;
}) => {
  if (!secondAmount) {
    return;
  }

  if (isFixedOutput || swapActionType !== SwapActionTypesEnum.swap) {
    return formatAmount({ input: secondAmount, decimals: secondTokenDecimals });
  }

  // Fixed-input swap minimum: floor(amount / (1 + t))
  const minAmount = new BigNumber(secondAmount)
    .idiv(new BigNumber(tolerance).dividedBy(100).plus(1))
    .toFixed(0);

  return formatAmount({ input: minAmount, decimals: secondTokenDecimals });
};
