import { gql } from '@apollo/client';
import { EsdtType, FactoryType, UserEsdtType, WrappingInfoType } from 'types';
import {
  esdtAttributes,
  factoryAttributes,
  userEsdtAttributes
} from '../attributes';

export interface TokensType {
  tokens: EsdtType[];
  factory: FactoryType;
  userTokens?: UserEsdtType[];
  wrappingInfo: WrappingInfoType[];
}

export const GET_TOKENS = gql`
  query swapPackageTokens ($identifiers: [String!], $enabledSwaps: Boolean) {
    tokens(identifiers: $identifiers, enabledSwaps: $enabledSwaps) {
      ${esdtAttributes}
    }
    wrappingInfo {
      wrappedToken {
        ${esdtAttributes}
      }
    }
    factory {
      ${factoryAttributes}
    }
  }
`;

export const GET_TOKENS_AND_BALANCE = gql`
  query swapPackageTokensWithBalance ($identifiers: [String!], $offset: Int, $limit: Int, $enabledSwaps: Boolean) {
    tokens(identifiers: $identifiers, enabledSwaps: $enabledSwaps) {
      ${esdtAttributes}
    }
    userTokens (offset: $offset, limit: $limit) {
      ${userEsdtAttributes}
    }
    wrappingInfo {
      wrappedToken {
        ${esdtAttributes}
      }
    }
    factory {
      ${factoryAttributes}
    }
  }
`;
