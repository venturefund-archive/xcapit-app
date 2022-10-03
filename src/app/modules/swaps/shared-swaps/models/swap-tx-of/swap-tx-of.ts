import { BlockchainTx } from "../blockchain-tx";
import { FixedIncreasedNumber } from "../fixed-increased-number/fixed-increased-number";
import { Referral } from "../referral/referral";
import { Slippage } from "../slippage/slippage";
import { Swap } from "../swap/swap";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Dex } from "../dex";
import { Wallet } from "../wallet/wallet";
import { BigNumber } from "ethers";


export class SwapTxOf implements BlockchainTx {

  private _cachedRawResponse = null;

  constructor(
    private _aSwap: Swap,
    private _fromWallet: Wallet,
    private _inDex: Dex,
    private _slippage: Slippage,
    private _referral: Referral
  ) { }

  async value(): Promise<TransactionRequest> {
    const rawResponse = await this._rawResponse();
    return {
      data: rawResponse.tx.data,
      to: rawResponse.tx.to,
      value: BigNumber.from(rawResponse.tx.value),
      gasPrice: BigNumber.from(rawResponse.tx.gasPrice),
      gasLimit: BigNumber.from(new FixedIncreasedNumber(rawResponse.tx.gas, 25).value())
    };
  }

  private async _rawResponse(): Promise<any> {
    if (!this._cachedRawResponse) {
      this._cachedRawResponse = await this._inDex.swap(
        this._aSwap,
        this._fromWallet,
        this._slippage,
        this._referral
      );
    }

    return this._cachedRawResponse;
  }
}
