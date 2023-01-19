import { RawBlockchain } from '../blockchain-repo/blockchain-repo';
import { IBlockchain } from '../blockchain/blockchain';
import { Token } from '../token/token';


export class BlockchainMM implements IBlockchain {
  private _compatibleDerivedPath = "m/44'/60'/0'/0/0";

  constructor(private _aBlockchain: IBlockchain) {}

  id(): string {
    return this._aBlockchain.id();
  }

  name(): string {
    return this._aBlockchain.name();
  }

  rpc(): string {
    return this._aBlockchain.rpc();
  }

  json(): RawBlockchain {
    return this._aBlockchain.json();
  }

  nativeToken(): Token {
    return this._aBlockchain.nativeToken();
  }

  derivedPath(): string {
    return this._compatibleDerivedPath;
  }
}
