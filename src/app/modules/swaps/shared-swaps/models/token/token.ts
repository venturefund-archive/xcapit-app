import { RawToken } from "../token-repo/token-repo";


export interface Token {

  blockchainId(): string;

  symbol(): string;

  decimals(): number;

  address(): string;

  json(): any;

  isNative()?: boolean;
}


export class DefaultToken implements Token {

  constructor(private _rawData: RawToken) { }

  symbol(): string {
    return this._rawData.value;
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

  isNative(): boolean {
    return this._rawData.native;
  }

  json(): RawToken {
    return this._rawData;
  }
}
