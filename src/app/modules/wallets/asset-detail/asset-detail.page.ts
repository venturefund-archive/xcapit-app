import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { WalletTransactionsService } from '../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { finalize } from 'rxjs/operators';
import { CovalentTransfer } from '../shared-wallets/models/covalent-transfer/covalent-transfer';
import { CovalentTransfersResponse } from '../shared-wallets/models/covalent-transfers-response/covalent-transfers-response';

@Component({
  selector: 'app-asset-detail',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
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
          <div class="wad__asset_amount__original" *ngIf="this.balance">
            <ion-text class="ux-font-num-titulo">
              {{ this.balance.amount | number: '1.2-6' }} {{ this.balance.symbol }}
            </ion-text>
          </div>
          <div class="wad__asset_amount__usd" *ngIf="this.balance?.usdAmount">
            <ion-text class="ux-font-num-subtitulo"> = {{ this.balance.usdAmount | number: '1.2-2' }} USD </ion-text>
          </div>
        </div>

        <div class="ion-margin-top" *ngIf="this.currency">
          <app-wallet-subheader-buttons [asset]="this.currency.value" [network]="this.currency.network"></app-wallet-subheader-buttons>
        </div>

        <div class="wad__transaction" *ngIf="!!this.transfers.length">
          <div class="wad__transaction__title">
            <ion-label class="ux-font-lato ux-fweight-bold ux-fsize-12" color="neutral80">
              {{ 'wallets.asset_detail.wallet_transaction_title' | translate }}
            </ion-label>
          </div>
          <div class="wad__transaction__wallet-transaction-card">
            <app-wallet-transaction-card [transactions]="this.transfers"></app-wallet-transaction-card>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./asset-detail.page.scss'],
})
export class AssetDetailPage implements OnInit {
  currency: Coin;
  coins: Coin[];
  walletAddress: string = null;
  balance: AssetBalance;
  transfers: CovalentTransfer[] = [];
  usdPrice: { prices: any };

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService,
    private storageService: StorageService,
    private walletTransactionsService: WalletTransactionsService,
    private apiWalletService: ApiWalletService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.coins = this.apiWalletService.getCoins();
    this.getCurrency();
    this.getBalanceStructure(this.currency);
    this.getTransfers();
    this.getUsdPrice();
  }

  private getBalanceStructure(coin) {
    this.balance = {
      icon: coin.logoRoute,
      symbol: coin.value,
      name: coin.name,
      amount: 0,
      usdAmount: 0,
      usdSymbol: 'USD',
    };
  }

  private getUsdPrice() {
    this.apiWalletService
      .getPrices([this.getCoinForPrice(this.currency.value)])
      .pipe(finalize(() => this.getAssetBalance()))
      .subscribe((res) => (this.usdPrice = res));
  }

  private getAssetBalance() {
    this.storageService.getWalletsAddresses(this.currency.network).then((address) => {
      this.walletService.balanceOf(address, this.currency.value).then((balance) => {
        this.balance.amount = parseFloat(balance);
        if (this.usdPrice) {
          this.balance.usdAmount = this.balance.amount * this.getUsdAmount(this.currency.value);
        }
      });
    });
  }

  private getCurrency() {
    this.currency = this.coins.find((c) => c.value === this.route.snapshot.paramMap.get('currency'));
  }

  private getTransfers() {
    this.storageService
      .getWalletsAddresses()
      .then((addresses: any) =>
        this.walletTransactionsService
          .getTransfers(addresses[this.currency.network], this.currency)
          .subscribe((res: CovalentTransfersResponse) => (this.transfers = res.value()))
      );
  }

  private getCoinForPrice(symbol: string): string {
    return symbol === 'RBTC' ? 'BTC' : symbol;
  }

  private getUsdAmount(symbol: string): number {
    return this.usdPrice.prices[this.getCoinForPrice(symbol)];
  }
}
