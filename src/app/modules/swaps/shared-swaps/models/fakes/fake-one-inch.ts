import { Dex } from "../dex";
import { Referral } from "../referral/referral";
import { Slippage } from "../slippage/slippage";
import { Swap } from "../swap/swap";
import { Token } from "../token/token";
import { DefaultWallet } from '../wallet/default/default-wallet';


export class FakeOneInch implements Dex {

  constructor(private _allowanceReturn: any = {}) { }

  swap(aSwap: Swap, fromWallet: DefaultWallet, slippage: Slippage, referral: Referral): Promise<any> {
    throw new Error("Method not implemented.");
  }
  approve(aSwap: Swap): Promise<any> {
    throw new Error("Method not implemented.");
  }
  tokens(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async allowance(aToken: Token, fromWallet: DefaultWallet): Promise<any> {
    return await this._allowanceReturn;
  }
  swapInfo(aSwap: Swap, aReferral: Referral): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
