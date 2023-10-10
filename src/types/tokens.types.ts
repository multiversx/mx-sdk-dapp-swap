export enum TokenTypesEnum {
  core = 'Core',
  ecosystem = 'Ecosystem',
  community = 'Community',
  experimental = 'Experimental',
  junglecommunity = 'Jungle-Community',
  jungle = 'Jungle',
  jungleexperimental = 'Jungle-Experimental',
  unlisted = 'Unlisted'
}

export interface AssetsType {
  website?: string;
  description?: string;
  status?: string;
  pngUrl?: string;
  svgUrl?: string;
  social?: any;
}

export interface EsdtType {
  balance: string | null;
  decimals: number;
  name: string;
  identifier: string;
  ticker: string;
  owner: string;
  assets?: AssetsType;
  price?: string;
  type?: TokenTypesEnum;
}

export interface UserEsdtType extends EsdtType {
  valueUSD: string;
  usdPrice?: string;
}

export interface WrappingInfoType {
  wrappedToken: EsdtType;
}
