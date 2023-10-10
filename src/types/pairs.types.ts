import { EsdtType, TokenTypesEnum } from './tokens.types';

export enum PairStatesEnum {
  inactive = 'Inactive',
  active = 'Active',
  activeNoSwaps = 'ActiveNoSwaps'
}

export interface LockedTokensInfoType {
  lockingScAddress: string;
  unlockEpoch: number;
}

export interface PairType {
  address: string;

  firstToken: EsdtType;
  firstTokenPrice: string;
  firstTokenPriceUSD: string;
  firstTokenVolume24h: string;
  firstTokenLockedValueUSD: string;

  secondToken: EsdtType;
  secondTokenPrice: string;
  secondTokenPriceUSD: string;
  secondTokenVolume24h: string;
  secondTokenLockedValueUSD: string;

  liquidityPoolToken: EsdtType;

  state: PairStatesEnum;
  type: TokenTypesEnum;
  lockedValueUSD: string;
  info: {
    reserves0: string;
    reserves1: string;
    totalSupply: string;
  };

  feesAPR: string;
  feesUSD24h: string;
  volumeUSD24h: string;
  totalFeePercent: number;
  specialFeePercent: number;

  lockedTokensInfo?: LockedTokensInfoType;
}

export interface FarmPairType {
  address: string;
  firstToken: EsdtType;
  firstTokenPriceUSD: string;
  secondToken: EsdtType;
  secondTokenPriceUSD: string;
  liquidityPoolToken: EsdtType;

  state: PairStatesEnum;
  type: TokenTypesEnum;
  info: {
    reserves0: string;
    reserves1: string;
    totalSupply: string;
  };

  feesAPR: string;
  totalFeePercent: number;
  specialFeePercent: number;
}
