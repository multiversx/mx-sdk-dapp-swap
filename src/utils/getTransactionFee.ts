import { IPlainTransactionObject } from '@multiversx/sdk-core';
import {
  GAS_LIMIT,
  GAS_PER_DATA_BYTE,
  GAS_PRICE_MODIFIER
} from '@multiversx/sdk-dapp/constants';
import { NetworkConfig } from '@multiversx/sdk-network-providers';
import { createTransactionFromRaw } from './createTransactionFromRaw';

export const getTransactionFee = (rawTransaction: IPlainTransactionObject) => {
  const transaction = createTransactionFromRaw(rawTransaction);

  const networkConfig = new NetworkConfig();
  networkConfig.MinGasLimit = GAS_LIMIT;
  networkConfig.GasPerDataByte = GAS_PER_DATA_BYTE;
  networkConfig.GasPriceModifier = GAS_PRICE_MODIFIER;
  try {
    const value = transaction.computeFee(networkConfig).toString(10);
    return value;
  } catch (err) {
    return 0;
  }
};
