import { RawTransactionType } from 'lib';

export interface WrappingQueryResponseType {
  wrapEgld?: RawTransactionType;
  unwrapEgld?: RawTransactionType;
}
