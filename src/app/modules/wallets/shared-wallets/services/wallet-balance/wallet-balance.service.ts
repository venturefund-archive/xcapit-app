import { Injectable } from '@angular/core';
import { AssetBalance } from '../../interfaces/asset-balance.interface';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { WalletService } from '../wallet/wallet.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WalletBalanceService {
  balances: Array<AssetBalance> = [];
  allPrices: any;
  userCoins: Coin[];

  constructor(private walletService: WalletService, private apiWalletService: ApiWalletService) {}

  async getUsdTotalBalance() {
    const sumUSDAmounts = function (total, currentBalance) {
      return total + currentBalance.usdAmount;
    };
    return this.balances.reduce(sumUSDAmounts, 0);
  }

  priceOf(aCoin: Coin): Promise<number> {
    return this.apiWalletService
      .getPrices([aCoin.value], false)
      .pipe(map((res) => res.prices[aCoin.value]))
      .toPromise();
  }

  async balanceOf(aCoin: Coin): Promise<number> {
    return this.walletService
      .balanceOf(this.walletService.addresses[aCoin.network], aCoin.value, aCoin.network)
      .then(parseFloat);
  }
}
