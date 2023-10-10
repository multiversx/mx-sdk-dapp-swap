import { gql } from '@apollo/client';
import { FactoryType } from 'types';
import { factoryAttributes } from '../attributes';

export interface AppDataType {
  factory: FactoryType;
}

export const appDataQuery = gql`
  query {
    factory {
      ${factoryAttributes}
    }
  }
`;
