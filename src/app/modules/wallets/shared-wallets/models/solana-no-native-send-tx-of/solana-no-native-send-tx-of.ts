import { createTransferInstruction } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { BlockchainTx } from "src/app/modules/swaps/shared-swaps/models/blockchain-tx";
import { Wallet } from "src/app/modules/swaps/shared-swaps/models/wallet/wallet";
import { AssociatedTokenAddress } from "../associated-token-address/associated-token-address";
import { SolanaNoNativeSend } from "../solana-no-native-send/solana-no-native-send";


export class SolanaNoNativeSendTxOf implements BlockchainTx {

  constructor(private _noNativeSend: SolanaNoNativeSend, private _aWallet: Wallet) {}

  async value(): Promise<Transaction> {
    return new Transaction().add(
      createTransferInstruction(
        await new AssociatedTokenAddress(this._noNativeSend.token(), this._aWallet.address(), null).value(),
        await new AssociatedTokenAddress(this._noNativeSend.token(), this._noNativeSend.toAddress(), null).value(),
        new PublicKey(this._aWallet.address()),
        this._noNativeSend.weiAmount().value().toNumber()
      )
    );
  }
}
