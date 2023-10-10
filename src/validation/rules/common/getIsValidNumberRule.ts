import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import { RuleType } from 'validation/types';

export const getIsValidNumberRule = (): RuleType<string | undefined> => ({
  name: 'isValidNumber',
  message: 'Only digits and one . allowed',
  test: (value) => Boolean(value && stringIsFloat(value))
});
