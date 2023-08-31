import { BigNumber } from "ethers";
import { Dex } from "src/app/modules/swaps/shared-swaps/models/dex";
import { Swap } from "src/app/modules/swaps/shared-swaps/models/swap/swap";
import { Wallet } from "src/app/modules/wallets/shared-wallets/models/wallet/wallet";


export class AllowanceOf {

  constructor(private _aSwap: Swap, private _fromWallet: Wallet, private _inDex: Dex) { }

  async value(): Promise<BigNumber> {
    return await this._allowance();
  }

  async isNotEnough(): Promise<boolean> {
    return (await this._allowance()).lt(this._aSwap.weiAmount().value());
  }

  private async _allowance(): Promise<BigNumber> {
    return BigNumber.from((await this._inDex.allowance(this._aSwap.fromToken(), this._fromWallet))['allowance']);
  }
}
