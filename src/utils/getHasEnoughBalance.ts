import BigNumber from 'bignumber.js';
import { parseAmount } from 'lib';
import { UserEsdtType } from 'types';

export const getHasEnoughBalance = ({
  token,
  amount = '0'
}: {
  amount?: string;
  token?: UserEsdtType;
}) => {
  if (!token || amount === '0') return false;
  if (token.balance === '0' || token.balance === '...') return false;

  const parsedAmount = parseAmount(amount, token.decimals);

  return new BigNumber(token.balance ?? '0')
    .minus(parsedAmount)
    .isGreaterThanOrEqualTo(0);
};
