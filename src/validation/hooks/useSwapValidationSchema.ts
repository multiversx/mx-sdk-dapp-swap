import { object, string } from 'yup';
import { TokenOptionType } from 'types/form.types';
import { SwapRouteType } from 'types/swap.types';
import { Shape } from 'types/yupShape.types';
import { getIsValidNumberRule } from 'validation/rules/common/getIsValidNumberRule';
import { getMinAmountRule } from 'validation/rules/common/getMinAmountRule';
import { getInputInsufficientFundsRule } from 'validation/rules/swap/getInputInsufficientFundsRule';
import { getTokenRequiredRule } from 'validation/rules/swap/getTokenRequiredRule';
import { getTooManyDecimalsRule } from 'validation/rules/swap/getTooManyDecimalsRule';
import { SwapFormType } from 'validation/types/swapForm.types';
import { applyValidationSchemaRules } from 'validation/utils';

type UseSwapValidationSchemaProps = {
  firstToken?: TokenOptionType;
  secondToken?: TokenOptionType;
  minAcceptedAmount?: number;
};

export const useSwapValidationSchema = ({
  minAcceptedAmount,
  firstToken,
  secondToken
}: UseSwapValidationSchemaProps) => {
  const commonInputRules = [
    getIsValidNumberRule(),
    getMinAmountRule({ minAcceptedAmount })
  ];

  const firstInputRules = [
    getTokenRequiredRule(firstToken?.value),
    getInputInsufficientFundsRule(firstToken?.token),
    getTooManyDecimalsRule(firstToken?.token)
  ];

  const firstInputValidationSchema = applyValidationSchemaRules(string(), [
    ...commonInputRules,
    ...firstInputRules
  ]);

  const secondInputRules = [
    getTokenRequiredRule(secondToken?.value),
    getTooManyDecimalsRule(secondToken?.token)
  ];

  const secondInputValidationSchema = applyValidationSchemaRules(string(), [
    ...commonInputRules,
    ...secondInputRules
  ]);

  return object().shape<Shape<SwapFormType>>({
    firstAmount: firstInputValidationSchema,
    secondAmount: secondInputValidationSchema,
    activeRoute: object<Shape<SwapRouteType>>().required('Required')
  });
};
