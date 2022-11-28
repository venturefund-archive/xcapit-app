import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { BlockchainTx } from "src/app/modules/swaps/shared-swaps/models/blockchain-tx";
import { Wallet } from "src/app/modules/swaps/shared-swaps/models/wallet/wallet";
import { AssociatedTokenAddress } from "../associated-token-address/associated-token-address";


export class AssociatedTokenAccountTxOf implements BlockchainTx {

  constructor(
    private _anAssociatedTokenAddress: AssociatedTokenAddress,
    private _aWallet: Wallet
  ) { }

  async value(): Promise<Transaction> {
    return new Transaction().add(
      createAssociatedTokenAccountInstruction(
        new PublicKey(this._aWallet.address()),
        await this._anAssociatedTokenAddress.value(),
        new PublicKey(this._anAssociatedTokenAddress.address()),
        new PublicKey(this._anAssociatedTokenAddress.token().address())
      )
    );
  }
}
