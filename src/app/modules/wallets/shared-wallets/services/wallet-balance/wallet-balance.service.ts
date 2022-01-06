import { Injectable } from '@angular/core';
import { AssetBalance } from '../../interfaces/asset-balance.interface';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletService } from '../wallet/wallet.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WalletBalanceService {
  balances: Array<AssetBalance> = [];
  allPrices: any;
  userCoins: Coin[];

  constructor(
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private storageService: StorageService
  ) {}

  private createBalancesStructure(coin: Coin): AssetBalance {
    return {
      icon: coin.logoRoute,
      symbol: coin.value,
      name: coin.name,
      amount: 0,
      usdAmount: 0,
      usdSymbol: 'USD',
    };
  }

  async getWalletsBalances() {
    await this.getAllPrices();
    this.balances = [];

    for (const coin of this.userCoins) {
      const walletAddress = this.walletService.addresses[coin.network];
      if (walletAddress) {
        const balance = this.createBalancesStructure(coin);
        // const raw_balance = await this.walletService.balanceOf(walletAddress, coin.value);
        const raw_balance = '0.0';
        balance.amount = parseFloat(raw_balance);

        // if (this.allPrices) {
        //   const usdPrice = this.getPrice(balance.symbol);
        //   balance.usdAmount = usdPrice * balance.amount;
        // }
        balance.usdAmount = 8;
        this.balances.push(balance);
      }
    }
    // this.orderBalancesByAmount();
    return this.balances;
  }

  async getUsdTotalBalance() {
    const sumUSDAmounts = function (total, currentBalance) {
      return total + currentBalance.usdAmount;
    };
    return this.balances.reduce(sumUSDAmounts, 0);
  }

  // private orderBalancesByAmount() {
  //   this.balances.sort((a, b) => {
  //     return b.usdAmount - a.usdAmount;
  //   });
  // }

  private getAllPrices() {
    return this.storageService.getAssestsSelected().then((coins) => {
      this.userCoins = coins;
      return this.storageService.updateAssetsList().then(() => {
        return this.apiWalletService
          .getPrices(this.userCoins.map((coin) => this.getCoinForPrice(coin.value)))
          .toPromise()
          .then((res) => {
            this.allPrices = res;
            return Promise.resolve(res);
          });
      });
    });
  }

  priceOf(aCoin: Coin): Promise<number> {
    return this.apiWalletService
      .getPrices([aCoin.value], false)
      .pipe(map((res) => res.prices[aCoin.value]))
      .toPromise();
  }

  balanceOf(aCoin: Coin): Promise<number> {
    return this.walletService.balanceOf(this.walletService.addresses[aCoin.network], aCoin.value).then(parseFloat);
  }

  private getCoinForPrice(symbol: string): string {
    return symbol === 'RBTC' ? 'BTC' : symbol;
  }

  private getPrice(symbol: string): number {
    return this.allPrices.prices[this.getCoinForPrice(symbol)];
  }
}
