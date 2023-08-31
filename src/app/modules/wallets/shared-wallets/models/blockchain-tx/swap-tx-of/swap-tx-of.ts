import { BlockchainTx } from "../blockchain-tx";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { Dex } from "src/app/modules/swaps/shared-swaps/models/dex";
import { FixedIncreasedNumber } from "src/app/modules/swaps/shared-swaps/models/fixed-increased-number/fixed-increased-number";
import { Referral } from "src/app/modules/swaps/shared-swaps/models/referral/referral";
import { Slippage } from "src/app/modules/swaps/shared-swaps/models/slippage/slippage";
import { Swap } from "src/app/modules/swaps/shared-swaps/models/swap/swap";
import { Wallet } from "src/app/modules/wallets/shared-wallets/models/wallet/wallet";


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
