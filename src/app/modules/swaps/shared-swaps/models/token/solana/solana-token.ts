import { Token } from '../token';
import { RawToken } from '../../token-repo/token-repo';

export class SolanaToken implements Token {
  constructor(private _rawData: RawToken) {}

  symbol(): string {
    return this._rawData.value;
  }

  network(): string {
    return this._rawData.network;
  }

  decimals(): number {
    return this._rawData.decimals;
  }

  blockchainId(): string {
    return `${this._rawData.chainId}`;
  }

  address(): string {
    return `${this._rawData.contract}`;
  }

  json(): RawToken {
    return this._rawData;
  }
}
