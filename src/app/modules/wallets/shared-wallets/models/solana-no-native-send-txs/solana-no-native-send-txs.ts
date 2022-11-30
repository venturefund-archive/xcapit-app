import { Connection } from "@solana/web3.js";
import { BlockchainTx } from "src/app/modules/swaps/shared-swaps/models/blockchain-tx";
import { FakeConnection } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-connection";
import { Wallet } from "src/app/modules/swaps/shared-swaps/models/wallet/wallet";
import { AssociatedTokenAccountTxOf } from "../associated-token-account-tx-of/associated-token-account-tx-of";
import { AssociatedTokenAddress } from "../associated-token-address/associated-token-address";
import { SolanaNoNativeSendTxOf } from "../solana-no-native-send-tx-of/solana-no-native-send-tx-of";
import { SolanaNoNativeSend } from "../solana-no-native-send/solana-no-native-send";


export class SolanaNoNativeSendTxs {

  private _transactions: BlockchainTx[];

  constructor(
    private _aNoNativeSend: SolanaNoNativeSend,
    private _aWallet: Wallet,
    private _aConnection: Connection | FakeConnection
  ) { }

  async blockchainTxs(): Promise<BlockchainTx[]> {
    this._cleanTransactions();
    await this._prepareATATx();
    this._prepareSendTx();
    return [ ...this._transactions ];
  }

  private async _prepareATATx() {
    const ata = new AssociatedTokenAddress(
      this._aNoNativeSend.token(),
      this._aNoNativeSend.toAddress(),
      this._aConnection
    );
    if (!(await ata.inBlockchain())) {
      this._transactions.push(new AssociatedTokenAccountTxOf(ata, this._aWallet));
    }
  }

  private _prepareSendTx() {
      this._transactions.push(new SolanaNoNativeSendTxOf(this._aNoNativeSend, this._aWallet));
  }

  private _cleanTransactions() {
    this._transactions = [];
  }
}
