import { Injectable } from '@angular/core';
import { resolve } from 'path';
import { AssetBalance } from '../../interfaces/asset-balance.interface';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable({
  providedIn: 'root',
})
export class WalletBalanceService {
  walletExist: boolean;
  totalBalanceWallet = 0;
  walletAddress = null;
  balances: Array<AssetBalance> = [];
  allPrices: any;
  userCoins: Coin[];
  alreadyInitialized = false;

  constructor(
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private storageService: StorageService
  ) {}

  createBalancesStructure(coin: Coin): AssetBalance {
    return {
      icon: coin.logoRoute,
      symbol: coin.value,
      name: coin.name,
      amount: 0,
      usdAmount: 0,
      usdSymbol: 'USD',
    };
  }

  // async encryptedWalletExist() {
  //   this.walletService.walletExist().then((res) => {
  //     this.walletExist = res;

  //     if (!this.alreadyInitialized && res) {
  //       this.alreadyInitialized = true;
  //       this.getAllPrices();
  //     }
  //   });
  // }

  getWalletsBalances() {
    return this.getAllPrices().then(() => {
      this.balances = [];

      for (const coin of this.userCoins) {
        const walletAddress = this.walletService.addresses[coin.network];

        if (walletAddress) {
          const balance = this.createBalancesStructure(coin);
          this.walletService.balanceOf(walletAddress, coin.value).then((res) => {
            balance.amount = parseFloat(res);

            if (this.allPrices) {
              const usdPrice = this.getPrice(balance.symbol);

              balance.usdAmount = usdPrice * balance.amount;
              this.totalBalanceWallet += balance.usdAmount;
            }
            this.balances.push(balance);
            this.orderBalancesByAmount();
            this.getUsdTotalBalance();
          });
        }
      }
      return Promise.resolve(this.balances);
    });
  }

  getUsdTotalBalance() {
    return this.getWalletsBalances().then(() => {
      const sumUSDAmounts = function (total, currentBalance) {
        return total + currentBalance.usdAmount;
      };
      const totalBalance = this.balances.reduce(sumUSDAmounts, 0);
      return Promise.resolve(totalBalance);
    });
  }

  orderBalancesByAmount() {
    this.balances.sort((a, b) => {
      return b.usdAmount - a.usdAmount;
    });
  }

  getAllPrices() {
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

  private uninitializedWallet() {
    this.alreadyInitialized = false;
  }

  private getCoinForPrice(symbol: string): string {
    return symbol === 'RBTC' ? 'BTC' : symbol;
  }

  private getPrice(symbol: string): number {
    return this.allPrices.prices[this.getCoinForPrice(symbol)];
  }
}
