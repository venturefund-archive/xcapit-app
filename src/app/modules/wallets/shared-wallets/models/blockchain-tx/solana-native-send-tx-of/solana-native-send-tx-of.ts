import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Wallet } from "src/app/modules/wallets/shared-wallets/models/wallet/wallet";
import { SolanaSend } from "../../solana-send/solana-send";
import { BlockchainTx } from "../blockchain-tx";


export class SolanaNativeSendTxOf implements BlockchainTx {

  constructor(private _aSolanaSend: SolanaSend, private _aWallet: Wallet) {}

  async value(): Promise<Transaction> {
    return new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(this._aWallet.address()),
        toPubkey: new PublicKey(this._aSolanaSend.toAddress()),
        lamports: this._aSolanaSend.weiAmount().value().toNumber()
      })
    );
  }
}
