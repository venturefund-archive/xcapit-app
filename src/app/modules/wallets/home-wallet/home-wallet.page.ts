import { Component, OnInit } from '@angular/core';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';

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
            {{ this.currency }}
          </ion-text>
        </div>
      </div>
      <div *ngIf="!this.haveWallets" class="wt__subheader">
        <app-wallets-subheader></app-wallets-subheader>
      </div>

      <!-- Assets list -->
      <div class="wt__balance ion-padding-start ion-padding-end" *ngIf="this.haveWallets && this.balances?.length">
        <div div class="wt__balance__title">
          <ion-label class="ux-font-lato ux-fweight-bold ux-fsize-12" color="uxsemidark">
            {{ 'wallets.home.wallet-balance-title' | translate }}
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
  haveWallets = true;
  transactions: Array<any>;
  assets: Array<any>;
  totalBalanceWallet = 0;
  currency = 'USD';
  balances: Array<AssetBalance> = [
    {
      icon: 'assets/img/coins/USDT.svg',
      symbol: 'USDT',
      name: 'Tether',
      amount: 3000,
      nativeTokenAmount: 1,
      nativeTokenSymbol: 'ETH',
    },
    {
      icon: 'assets/img/coins/ETH.svg',
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 1,
      nativeTokenAmount: 1,
      nativeTokenSymbol: 'ETH',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
