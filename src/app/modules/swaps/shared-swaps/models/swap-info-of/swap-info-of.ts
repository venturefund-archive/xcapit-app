import { AmountOf } from "../amount-of/amount-of";
import { Dex } from "../dex";
import { Referral } from "../referral/referral";
import { Swap } from "../swap/swap";


export class SwapInfoOf {

  private _cachedSwapInfo: any;

  constructor(private _aSwap: Swap, private _inDex: Dex, private _referral: Referral) { }

  async estimatedGas(): Promise<number> {
    return (await this._rawSwapInfo())['estimatedGas'];
  }

  async toTokenAmount(): Promise<AmountOf> {
    return new AmountOf(
      (await this._rawSwapInfo())['toTokenAmount'],
      this._aSwap.toToken()
    );
  }

  private async _rawSwapInfo(): Promise<any> {
    this._cachedSwapInfo = this._cachedSwapInfo ?? await this._inDex.swapInfo(this._aSwap, this._referral);
    return this._cachedSwapInfo;
  }
}
