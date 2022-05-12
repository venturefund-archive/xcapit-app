import { RawBlockchain } from "../blockchain-repo/blockchain-repo";


export class Blockchain {

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
}
