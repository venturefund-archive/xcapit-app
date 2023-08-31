import { Connection } from "@solana/web3.js";
import { IBlockchain } from "src/app/modules/swaps/shared-swaps/models/blockchain/blockchain";
import { FakeConnection } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-connection";
import { Wallet } from "src/app/modules/wallets/shared-wallets/models/wallet/wallet";
import { SolanaNativeSendTxOf } from "../solana-native-send-tx-of/solana-native-send-tx-of";
import { SolanaNoNativeSendTxsOf } from "../solana-no-native-send-txs-of/solana-no-native-send-txs-of";
import { SolanaSend } from "../../solana-send/solana-send";
import { BlockchainTx } from "../blockchain-tx";


export class SolanaSendTxsOf {
  constructor(
    private _aSolanaSend: SolanaSend,
    private _aWallet: Wallet,
    private _aBlockchain: IBlockchain,
    private _aConnection: Connection | FakeConnection
  ) {}

  async blockchainTxs(): Promise<BlockchainTx[]> {
    return this._isNativeToken() ?
      [new SolanaNativeSendTxOf(this._aSolanaSend, this._aWallet)] :
      await new SolanaNoNativeSendTxsOf(
        this._aSolanaSend,
        this._aWallet,
        this._aConnection
      ).blockchainTxs();
  }

  private _isNativeToken(): boolean {
    return this._aSolanaSend.token().address() === this._aBlockchain.nativeToken().address();
  }
}
