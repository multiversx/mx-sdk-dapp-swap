import { esdtAttributes } from './esdt';

export const pairAttributes = `
  address
  firstToken {
    ${esdtAttributes}
  }
  secondToken {
    ${esdtAttributes}
  }
`;

export const smartSwapPairAttributes = `
  dex
  ${pairAttributes}
`;
