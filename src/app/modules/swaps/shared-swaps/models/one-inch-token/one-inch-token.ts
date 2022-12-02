import { Token } from "../token/token";


export class OneInchToken implements Token {

  constructor(private _rawData: any) {
  }

  blockchainId(): string {
    throw new Error("Method not implemented.");
  }

  symbol(): string {
    return this._rawData['symbol'];
  }

  network(): string {
    throw new Error("Method not implemented.");
  }

  decimals(): number {
    return this._rawData['decimals'];
  }

  address(): string {
    return this._rawData['address'];
  }

  json() {
    throw new Error("Method not implemented.");
  }
}
