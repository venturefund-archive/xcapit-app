import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { WalletTransactionsService } from '../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { COINS } from '../constants/coins';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-asset-detail',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.asset_detail.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="wad ion-padding">
      <div class="ux_content">
        <app-ux-title class="ion-padding-top ion-margin-top ">
          <div class="wad__title ion-margin-top" *ngIf="this.currency">
            <div>
              <ion-img class="wad__title__img" [src]="this.currency.logoRoute"></ion-img>
            </div>

            {{ this.currency.name }}
          </div>
        </app-ux-title>

        <div class="wad__asset_amount ion-margin-top">
          <div class="wad__asset_amount__original" *ngIf="this.balance?.length > 0">
            {{ this.balance[0].amount | number: '1.2-6' }}
            <div class="wad__asset_amount__original__symbol">
              {{ this.balance[0].symbol }}
            </div>
          </div>
          <div class="wad__asset_amount__usd" *ngIf="this.balance?.length > 0">
            = {{ this.balance[0].usdAmount | number: '1.2-2' }} USD
          </div>
        </div>

        <div class="ion-margin-top" *ngIf="this.currency">
          <app-wallet-subheader-buttons
            [hasTransactions]="this.transactionsExists"
            [asset]="this.currency.value"
          ></app-wallet-subheader-buttons>
        </div>

        <div class="wad__transaction" *ngIf="this.transactionsExists && this.balance?.length > 0">
          <div div class="wad__transaction__title">
            <ion-label class="ux-font-lato ux-fweight-bold ux-fsize-12" color="uxsemidark">
              {{ 'wallets.asset_detail.wallet_transaction_title' | translate }}
            </ion-label>
          </div>
          <div class="wad__transaction__wallet-transaction-card">
            <app-wallet-transaction-card [transactions]="this.allTransactions"></app-wallet-transaction-card>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./asset-detail.page.scss'],
})
export class AssetDetailPage implements OnInit {
  currency: Coin;
  coins = COINS;
  walletAddress: string = null;
  balance: Array<AssetBalance> = [];
  transactionsExists = false;
  allTransactions = [];
  usdPrice: any;

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService,
    private storageService: StorageService,
    private walletTransactionsService: WalletTransactionsService,
    private apiWalletService: ApiWalletService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getAllTransactions();
  }

  getBalanceStructure(coin) {
    return [
      {
        icon: coin.logoRoute,
        symbol: coin.value,
        name: coin.name,
        amount: 0,
        usdAmount: 0,
        usdSymbol: 'USD',
      },
    ];
  }

  getUsdPrice() {
    const coin = [];
    coin.push(this.getCoinForPrice(this.currency.value));

    this.apiWalletService
      .getPrices(coin)
      .pipe(finalize(() => this.getAssetBalance()))
      .subscribe((res) => (this.usdPrice = res));
  }

  async getAssetBalance() {
    this.walletAddress = await this.storageService.getWalletsAddresses(this.currency.network);

    if (this.walletAddress) {
      this.balance = this.getBalanceStructure(this.currency);

      this.walletService.balanceOf(this.walletAddress, this.currency.value).then(async (balance) => {
        this.balance[0].amount = parseFloat(balance);
        if (this.usdPrice) {
          const usdAmount = this.getUsdAmount(this.currency.value);
          this.balance[0].usdAmount = this.balance[0].amount * usdAmount;
        }
      });
    }
  }

  async getAllTransactions() {
    this.currency = this.coins.find((c) => c.value === this.route.snapshot.paramMap.get('currency'));
    this.walletTransactionsService.getAllTransactions(this.currency.value).then((res) => {
      if (res.length > 0) {
        this.transactionsExists = true;
      }

      this.allTransactions = res;
      this.getUsdPrice();
    });
  }

  private getCoinForPrice(symbol: string): string {
    return symbol === 'RBTC' ? 'BTC' : symbol;
  }

  private getUsdAmount(symbol: string): number {
    if (symbol === 'USDT') {
      return 1;
    }

    return this.usdPrice.prices[this.getCoinForPrice(symbol)];
  }
}
