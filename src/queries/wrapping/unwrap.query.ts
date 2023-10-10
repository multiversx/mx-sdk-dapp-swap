import { gql } from '@apollo/client';
import { transactionAttributes } from 'queries/attributes/transaction';

export const unwrapEgldQuery = gql`
  query ($wrappingAmount: String!) {
    unwrapEgld(amount: $wrappingAmount) {
      ${transactionAttributes}
    }
  }
`;
