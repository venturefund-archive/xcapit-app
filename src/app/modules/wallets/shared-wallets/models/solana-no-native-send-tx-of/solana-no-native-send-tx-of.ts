import { createTransferInstruction } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { BlockchainTx } from "src/app/modules/swaps/shared-swaps/models/blockchain-tx";
import { Wallet } from "src/app/modules/swaps/shared-swaps/models/wallet/wallet";
import { AssociatedTokenAddress } from "../associated-token-address/associated-token-address";
import { SolanaSend } from "../solana-send/solana-send";


export class SolanaNoNativeSendTxOf implements BlockchainTx {

  constructor(private _aSolanaSend: SolanaSend, private _aWallet: Wallet) {}

  async value(): Promise<Transaction> {
    return new Transaction().add(
      createTransferInstruction(
        await new AssociatedTokenAddress(this._aSolanaSend.token(), this._aWallet.address(), null).value(),
        await new AssociatedTokenAddress(this._aSolanaSend.token(), this._aSolanaSend.toAddress(), null).value(),
        new PublicKey(this._aWallet.address()),
        this._aSolanaSend.weiAmount().value().toNumber()
      )
    );
  }
}
