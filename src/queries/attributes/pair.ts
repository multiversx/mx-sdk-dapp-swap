import { esdtAttributes } from './esdt';
import { simpleLockAttributes } from './simpleLock';

export const pairAttributes = `
  address
  firstToken {
    ${esdtAttributes}
  }
  firstTokenPrice
  firstTokenPriceUSD
  firstTokenVolume24h
  firstTokenLockedValueUSD
  
  secondToken {
    ${esdtAttributes}
  }
  secondTokenPrice
  secondTokenPriceUSD
  secondTokenVolume24h
  secondTokenLockedValueUSD

  liquidityPoolToken {
    ${esdtAttributes}
  }

  state
  type
  lockedValueUSD
  info {
    reserves0
    reserves1
    totalSupply
  }

  feesAPR
  feesUSD24h
  volumeUSD24h
  totalFeePercent
  specialFeePercent

  lockedTokensInfo {
    lockingSC {
      ${simpleLockAttributes}
    }
    unlockEpoch
  }
`;
