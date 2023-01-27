import { RawBlockchain } from "../blockchain-repo/blockchain-repo";
import { DefaultToken, Token } from "../token/token";


export interface IBlockchain {
  id(): string;
  name(): string;
  rpc(): string;
  derivedPath(): string;
  json(): RawBlockchain;
  nativeToken(): Token;
}


export class Blockchain implements IBlockchain {

  constructor(private _rawData: RawBlockchain) { }

  id(): string {
    return this._rawData.id;
  }

  name(): string {
    return this._rawData.name;
  }

  rpc(): string {
    return this._rawData.rpc;
  }

  derivedPath(): string {
    return this._rawData.derivedPath;
  }

  json(): RawBlockchain {
    return { ...this._rawData };
  }

  nativeToken(): Token {
    return new DefaultToken({...this._rawData.nativeToken, network: this._rawData.name});
  }
}
