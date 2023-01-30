import { TxHash } from '../tx-hash.interface';

export class DefaultTxHash implements TxHash {
  constructor(private _aHash: string) {}

  value(): string {
    return this._aHash;
  }
}
