import { AllowanceOf } from "../allowance-of/allowance-of";
import { ApproveTxOf } from "../approve-tx-of/approve-tx-of";
import { BlockchainTx } from "../blockchain-tx";
import { Dex } from "../dex";
import { Referral } from "../referral/referral";
import { Slippage } from "../slippage/slippage";
import { Swap } from "../swap/swap";
import { SwapTxOf } from "../swap-tx-of/swap-tx-of";
import { Wallet } from "../wallet/wallet";


export class SwapTransactions {

  private _transactions: BlockchainTx[];

  constructor(
    private _aSwap: Swap,
    private _fromWallet: Wallet,
    private _inDex: Dex,
    private _referral: Referral = new Referral(),
    private _slippage: Slippage = new Slippage()
  ) { }

  async blockchainTxs(): Promise<BlockchainTx[]> {
    this._cleanTransactions();
    await this._prepareTransactions();
    return [ ...this._transactions ];
  }

  private async _prepareTransactions() {
    await this._prepareApproveTx();
    this._prepareSwapTx();
  }

  private async _prepareApproveTx() {
    if (await this._isNotEnoughToSwap()) {
      this._transactions.push(new ApproveTxOf(this._aSwap, this._inDex));
    }
  }

  private async _isNotEnoughToSwap(): Promise<boolean> {
    return await new AllowanceOf(this._aSwap, this._fromWallet, this._inDex).isNotEnough();
  }

  private _prepareSwapTx() {
    this._transactions.push(new SwapTxOf(this._aSwap, this._fromWallet, this._inDex, this._slippage, this._referral));
  }

  private _cleanTransactions() {
    this._transactions = [];
  }
}