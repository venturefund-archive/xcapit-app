import { Component, OnInit } from '@angular/core';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { COINS } from '../constants/coins';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';

@Component({
  selector: 'app-home-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar"> </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="wt__subheader__value">
        <div class="wt__title ux-font-lato ux-fweight-regular ux-fsize-16">
          <ion-text>
            {{ 'wallets.home.available_money' | translate }}
          </ion-text>
        </div>
        <div class="wt__amount ux-font-gilroy ux-fweight-extrabold ux-fsize-40">
          <ion-text>
            {{ this.totalBalanceWallet | number: '1.2-6' }}
            USD
          </ion-text>
        </div>
      </div>
      <div class="wt__subheader" *ngIf="this.balances?.length == 0">
        <app-wallets-subheader [walletExist]="this.walletExist"></app-wallets-subheader>
      </div>

      <div class="wt__balance ion-padding-start ion-padding-end" *ngIf="this.walletExist && this.balances?.length">
        <div div class="wt__balance__title">
          <ion-label class="ux-font-lato ux-fweight-bold ux-fsize-12" color="uxsemidark">
            {{ 'wallets.home.wallet_balance_title' | translate }}
          </ion-label>
        </div>
        <div class="wt__balance__wallet-balance-card">
          <app-wallet-balance-card [balances]="this.balances"></app-wallet-balance-card>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./home-wallet.page.scss'],
})
export class HomeWalletPage implements OnInit {
  walletExist = false;
  transactions: Array<any>;
  totalBalanceWallet = 0;
  walletAddress = null;
  balances: Array<AssetBalance>;
  allPrices: any;

  coins = COINS;

  constructor(private walletService: WalletService, private apiWalletService: ApiWalletService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.encryptedWalletExist();
  }

  createBalancesStructure(coin: Coin): AssetBalance {
    const balance = {
      icon: coin.logoRoute,
      symbol: coin.value,
      name: coin.name,
      amount: 0,
      usdAmount: 0,
      usdSymbol: 'USD',
    };

    return balance;
  }

  encryptedWalletExist() {
    this.walletService.walletExist().then((res) => {
      this.walletExist = res;

      if (res) {
        this.balances = [];
        this.getAllPrices();
      }
    });
  }

  getWalletsBalances() {
    const balances = [];
    this.totalBalanceWallet = 0;

    for (const coin of this.coins) {
      this.walletAddress = this.walletService.addresses[coin.network];

      if (this.walletAddress) {
        const balance = this.createBalancesStructure(coin);

        this.walletService.balanceOf(this.walletAddress, coin.value).then((res) => {
          balance.amount = parseFloat(res);
          const usdPrice = this.getPrice(balance.symbol);

          balance.usdAmount = usdPrice * balance.amount;
          this.totalBalanceWallet += balance.usdAmount;

          balances.push(balance);

          this.walletAddress = null;
        });
      }
    }

    this.balances = balances;
  }

  async getAllPrices() {
    this.apiWalletService.getPrices(this.coins.map((coin) => this.getCoinForPrice(coin.value))).subscribe({
      next: (res) => {
        this.allPrices = res;
      },
      complete: () => {
        this.getWalletsBalances();
      },
    });
  }

  private getCoinForPrice(symbol: string): string {
    return symbol === 'RBTC' ? 'BTC' : symbol;
  }

  private getPrice(symbol: string): number {
    console.log(symbol);
    if (symbol === 'USDT') {
      return 1;
    }
    console.log(this.allPrices.prices[this.getCoinForPrice(symbol)]);

    return this.allPrices.prices[this.getCoinForPrice(symbol)];
  }
}
