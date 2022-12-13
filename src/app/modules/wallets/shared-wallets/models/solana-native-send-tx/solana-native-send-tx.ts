import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { BlockchainTx } from 'src/app/modules/swaps/shared-swaps/models/blockchain-tx';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';


export class SolanaNativeSendTx implements BlockchainTx {

  constructor(
    private _wallet: Wallet,
    private _to: string,
    private _lamports: number
  ) {}

  async value(): Promise<Transaction> {
    return new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(this._wallet.address()),
        toPubkey: new PublicKey(this._to),
        lamports: this._lamports
      })
    );
  }
}