import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';


export class AssociatedTokenAddress {
  constructor(private _aToken: Token, private _aWallet: Wallet) {}

  value(): Promise<PublicKey> {
    return getAssociatedTokenAddress(
      new PublicKey(this._aToken.address()),
      new PublicKey(this._aWallet.address()));
  }
}
