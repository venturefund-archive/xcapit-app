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
import { NETWORK_COLORS } from '../shared-wallets/constants/network-colors.constant';
import { ProvidersFactory } from '../../fiat-ramps/shared-ramps/models/providers/factory/providers.factory';
import { HttpClient } from '@angular/common/http';
import { ProviderDataRepo } from '../../fiat-ramps/shared-ramps/models/provider-data-repo/provider-data-repo';
import { ProviderTokensOf } from '../../fiat-ramps/shared-ramps/models/provider-tokens-of/provider-tokens-of';

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
        <ion-card class="wad__card">
          <div class="wad__title_and_image" *ngIf="this.currency">
            <div class="wad__title_and_image__image_container">
              <img [src]="this.currency.logoRoute" alt="Product Image" />
            </div>
            <div class="wad__title_container">
              <div class="wad__title_container__title">
                <ion-text class="ux-font-text-lg">{{ this.currency.value }}</ion-text>
                <ion-text class="ux-font-text-xs title">{{ this.currency.name | splitString: ' - '[1] }}</ion-text>
              </div>
              <div class="wad__title_container__badge">
                <ion-badge [color]="this.networkColors[this.currency.network]" class="ux-badge ux-font-num-subtitulo">{{
                  this.currency.network | formattedNetwork | uppercase
                }}</ion-badge>
              </div>
            </div>
          </div>
  
          <div class="wad__available text-center">
            <ion-text class="title ux-font-titulo-xs">
              {{ 'wallets.asset_detail.available' | translate }}
            </ion-text>
            <div class="wad__available__amounts" *ngIf="this.balance">
              <ion-text class="ux-font-text-xl" color="neutral80">
                {{ this.balance.amount | formattedAmount }} {{ this.balance.symbol }}</ion-text
              >
              <ion-text class="ux-font-text-xxs" color="neutral80" *ngIf="this.balance?.usdAmount">
                ≈ {{ this.balance.usdAmount | formattedAmount: 10:2 }} USD
              </ion-text>
            </div>
          </div>
        </ion-card>

        <div class="wad__subheader_buttons" *ngIf="this.currency">
          <app-wallet-subheader-buttons
            [asset]="this.currency.value"
            [network]="this.currency.network"
            [enabledToBuy]="this.enabledToBuy"
          ></app-wallet-subheader-buttons>
        </div>

        <div class="wad__transaction" *ngIf="!!this.transfers.length">
          <div class="wad__transaction__title">
            <ion-label class="ux-font-text-lg ">
              {{ 'wallets.asset_detail.wallet_transaction_title' | translate }}
            </ion-label>
          </div>
          <div class="wad__transaction__wallet-transaction-card">
            <app-wallet-transaction-card
              [transactions]="this.transfers"
              [network]="this.currency.network"
            ></app-wallet-transaction-card>
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
  networkColors = NETWORK_COLORS;
  enabledToBuy: boolean;

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService,
    private storageService: StorageService,
    private walletTransactionsService: WalletTransactionsService,
    private apiWalletService: ApiWalletService,
    private providers: ProvidersFactory,
    private http: HttpClient
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
    this.enabledToBuy = !!new ProviderTokensOf(this.getProviders(), [ this.currency ]).all().length;
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

  private getProviders() {
    return this.providers.create(new ProviderDataRepo(), this.http);
  }

}
