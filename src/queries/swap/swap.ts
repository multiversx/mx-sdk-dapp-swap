import { gql } from '@apollo/client';
import { SwapRouteType } from 'types';
import {
  transactionAttributes,
  pairAttributes,
  smartSwapPairAttributes
} from '../attributes';

const transactionsPlaceholder = 'TRANSACTIONS_PLACEHOLDER';

const transactionsString = `
  transactions {
    ${transactionAttributes}
  }
`;

const swapString = `
  query swapPackageSwapRoute (
    $amountIn: String
    $amountOut: String
    $tokenInID: String!
    $tokenOutID: String!
    $tolerance: Float!
  ) {
    swap(
      amountIn: $amountIn
      amountOut: $amountOut
      tokenInID: $tokenInID
      tokenOutID: $tokenOutID
      tolerance: $tolerance
    ) {
      amountIn
      tokenInID
      tokenInPriceUSD
      tokenInExchangeRateDenom

      amountOut
      tokenOutID
      tokenOutPriceUSD
      tokenOutExchangeRateDenom

      swapType
      tokenRoute
      pricesImpact

      maxPriceDeviationPercent
      tokensPriceDeviationPercent

      intermediaryAmounts
      pairs {
        ${pairAttributes}
      }
      smartSwap {
        source
        feeToken
        feeAmount
        feePercentage
        amountOut
        tokenOutExchangeRateDenom
        tokenInExchangeRateDenom
        tokensPriceDeviationPercent
        routes {
          pairs {
            ${smartSwapPairAttributes}
          }
          tokenRoute
          pricesImpact
          intermediaryAmounts
        }
      }
      ${transactionsPlaceholder}
    }
  }
`;

export const swapQuery = gql`
  ${swapString.replace(transactionsPlaceholder, transactionsString)}
`;

export const swapWithoutTransactionsQuery = gql`
  ${swapString.replace(transactionsPlaceholder, '')}
`;

export interface SwapRouteQueryResponseType {
  swap: SwapRouteType;
}
