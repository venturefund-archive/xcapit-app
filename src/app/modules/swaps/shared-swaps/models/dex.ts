import { Referral } from "./referral/referral";
import { Slippage } from "./slippage/slippage";
import { Swap } from "./swap/swap";
import { Token } from "./token/token";
import { Wallet } from "../../../wallets/shared-wallets/models/wallet/wallet";


export interface Dex {
  swap(aSwap: Swap, fromWallet: Wallet, slippage: Slippage, referral: Referral): Promise<any>;
  approve(aSwap: Swap): Promise<any>;
  tokens(): Promise<any>;
  allowance(aToken: Token, fromWallet: Wallet): Promise<any>;
  swapInfo(aSwap: Swap, aReferral: Referral): Promise<any>;
}
