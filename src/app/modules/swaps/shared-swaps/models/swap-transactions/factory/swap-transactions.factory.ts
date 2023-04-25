import { Injectable } from "@angular/core";
import { Dex } from "../../dex";
import { Referral } from "../../referral/referral";
import { Slippage } from "../../slippage/slippage";
import { Swap } from "../../swap/swap";
import { Wallet } from "../../wallet/wallet";
import { SwapTransactions } from "../swap-transactions";


@Injectable({ providedIn: 'root' })
export class SwapTransactionsFactory {

  create(
    _aSwap: Swap,
    _fromWallet: Wallet,
    _inDex: Dex,
    _referral: Referral = new Referral(),
    _slippage: Slippage = new Slippage()
  ): SwapTransactions {
    return new SwapTransactions(_aSwap, _fromWallet, _inDex, _referral, _slippage);
  }
}
