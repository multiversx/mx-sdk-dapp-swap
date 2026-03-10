import { EsdtType } from './tokens.types';

export enum PairStatesEnum {
  active = 'Active',
  inactive = 'Inactive',
  partialActive = 'PartialActive'
}

export interface PairType {
  dex?: string;
  address: string;
  firstToken: EsdtType;
  secondToken: EsdtType;
}
