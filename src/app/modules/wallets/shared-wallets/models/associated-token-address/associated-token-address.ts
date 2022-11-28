import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { FakeConnection } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-connection';


export class AssociatedTokenAddress {

  constructor(
    private _aToken: Token,
    private _anAddress: string,
    private _aConnection: Connection | FakeConnection
  ) {}

  value(): Promise<PublicKey> {
    return getAssociatedTokenAddress(
      new PublicKey(this._aToken.address()),
      new PublicKey(this._anAddress)
    );
  }

  async inBlockchain(): Promise<boolean> {
    return !!(await this._aConnection.getTokenAccountsByOwner(
      new PublicKey(this._anAddress),
      { mint: new PublicKey(this._aToken.address()) }
    )).value[0]?.pubkey;
  }

  token(): Token {
    return this._aToken;
  }

  address(): string {
    return this._anAddress;
  }
}
