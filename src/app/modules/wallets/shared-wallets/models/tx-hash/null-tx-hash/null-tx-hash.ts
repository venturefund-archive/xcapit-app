import { TxHash } from '../tx-hash.interface';

export class NullTxHash implements TxHash {
  constructor() {}

  value(): string {
    return '';
  }
}
