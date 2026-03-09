import { IPlainTransactionObject } from 'lib';
import { PairType } from './pairs.types';
import { UserEsdtType } from './tokens.types';

export enum PriceImpactLevelEnum {
  normal = 'normal',
  high = 'high',
  veryHigh = 'veryHigh'
}

export interface RouteType {
  pairs: PairType[];
  tokenRoute: string[];
  pricesImpact: string[];
  intermediaryAmounts: string[];
}

export interface PlatformFeeType {
  feeAmount: string;
  feePercentage: number;
}

export interface SmartRouteType extends PlatformFeeType {
  amountOut: string;
  routes: RouteType[];
  tokenInExchangeRateDenom: string;
  tokenOutExchangeRateDenom: string;
  tokensPriceDeviationPercent: number;
}

export interface SwapRouteType {
  source: string;

  amountIn: string;
  tokenInID: string;
  tokenInPriceUSD: string;
  tokenInExchangeRateDenom: string;

  amountOut: string;
  tokenOutID: string;
  tokenOutPriceUSD: string;
  tokenOutExchangeRateDenom: string;

  swapType: number; // 0 fixedInput, 1 fixedOutput
  tokenRoute: string[];
  pricesImpact: string[];

  maxPriceDeviationPercent: number;
  tokensPriceDeviationPercent: number;

  pairs: PairType[];
  intermediaryAmounts: string[];
  transactions?: IPlainTransactionObject[];

  smartSwap: SmartRouteType | null;
}

export enum SwapActionTypesEnum {
  wrap = 'wrap',
  unwrap = 'unwrap',
  swap = 'swap'
}

export interface TokenType {
  node: UserEsdtType;
  cursor: string;
}

export interface FilteredTokensType {
  edges?: TokenType[];
  pageData?: EsdtPageDataType;
  pageInfo?: EsdtPageInfoType;
}

export interface EsdtPageInfoType {
  startCursor?: string;
  endCursor?: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface EsdtPageDataType {
  count: number;
  limit: number;
  offset: number;
}
