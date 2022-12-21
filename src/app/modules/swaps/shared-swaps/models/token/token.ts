import { RawToken } from "../token-repo/token-repo";


export interface Token {

  blockchainId(): string;

  symbol(): string;

  network(): string;

  decimals(): number;

  address(): string;

  json(): any;
}


export class DefaultToken implements Token {

  constructor(private _rawData: RawToken) { }

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
    return `${this._rawData.contract}`.toLocaleLowerCase();
  }

  json(): RawToken {
    return this._rawData;
  }
}
