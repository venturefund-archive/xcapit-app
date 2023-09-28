import { AmountOf } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of';
import { Dex } from '../dex';
import { GasUnits } from '../gas-units/gas-units';
import { Referral } from '../referral/referral';
import { Swap } from '../swap/swap';

export class SwapInfoOf {
  private _cachedSwapInfo: any;

  constructor(private _aSwap: Swap, private _inDex: Dex, private _referral: Referral) {}

  async estimatedGas(): Promise<GasUnits> {
    return new GasUnits((await this._rawSwapInfo())['gas']);
  }

  async toTokenAmount(): Promise<AmountOf> {
    return new AmountOf((await this._rawSwapInfo())['toAmount'], this._aSwap.toToken());
  }

  private async _rawSwapInfo(): Promise<any> {
    this._cachedSwapInfo = this._cachedSwapInfo ?? (await this._inDex.swapInfo(this._aSwap, this._referral));
    return this._cachedSwapInfo;
  }
}
