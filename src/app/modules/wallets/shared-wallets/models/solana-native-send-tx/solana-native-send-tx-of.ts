import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { BlockchainTx } from "src/app/modules/swaps/shared-swaps/models/blockchain-tx";
import { Wallet } from "src/app/modules/swaps/shared-swaps/models/wallet/wallet";
import { SolanaNoNativeSend } from "../solana-no-native-send/solana-no-native-send";


export class SolanaNativeSendTxOf implements BlockchainTx {

  constructor(private _noNativeSend: SolanaNoNativeSend, private _aWallet: Wallet) {}

  async value(): Promise<Transaction> {
    return new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(this._aWallet.address()),
        toPubkey: new PublicKey(this._noNativeSend.toAddress()),
        lamports: this._noNativeSend.weiAmount().value().toNumber()
      })
    );
  }
}
