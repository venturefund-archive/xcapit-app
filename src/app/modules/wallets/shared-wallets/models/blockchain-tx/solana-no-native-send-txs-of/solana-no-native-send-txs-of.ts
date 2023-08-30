import { Connection } from "@solana/web3.js";
import { FakeConnection } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-connection";
import { Wallet } from "src/app/modules/wallets/shared-wallets/models/wallet/wallet";
import { AssociatedTokenAccountTxOf } from "../associated-token-account-tx-of/associated-token-account-tx-of";
import { SolanaNoNativeSendTxOf } from "../solana-no-native-send-tx-of/solana-no-native-send-tx-of";
import { AssociatedTokenAddress } from "../../associated-token-address/associated-token-address";
import { SolanaSend } from "../../solana-send/solana-send";
import { BlockchainTx } from "../blockchain-tx";


export class SolanaNoNativeSendTxsOf {

  private _transactions: BlockchainTx[];

  constructor(
    private _aSolanaSend: SolanaSend,
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
      this._aSolanaSend.token(),
      this._aSolanaSend.toAddress(),
      this._aConnection
    );
    if (!(await ata.inBlockchain())) {
      this._transactions.push(new AssociatedTokenAccountTxOf(ata, this._aWallet));
    }
  }

  private _prepareSendTx() {
      this._transactions.push(new SolanaNoNativeSendTxOf(this._aSolanaSend, this._aWallet));
  }

  private _cleanTransactions() {
    this._transactions = [];
  }
}
