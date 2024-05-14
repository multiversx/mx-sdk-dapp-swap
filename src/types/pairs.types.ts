import { EsdtType, NftCollectionType, TokenTypesEnum } from './tokens.types';

export enum PairStatesEnum {
  active = 'Active',
  inactive = 'Inactive',
  partialActive = 'PartialActive'
}

export interface SimpleLockType {
  address: string;

  lockedToken: NftCollectionType; // LKESDT
  lpProxyToken: NftCollectionType; // LKLP
  farmProxyToken: NftCollectionType; // LKFARM

  intermediatedPairs: string[];
  intermediatedFarms: string[];
}

export interface LockedTokensInfoType {
  unlockEpoch: number;
  lockingSC: SimpleLockType;
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
