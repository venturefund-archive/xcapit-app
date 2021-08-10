import { Component, OnInit } from '@angular/core';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';

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
            ETH
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
  totalBalanceWallet = 0;
  walletAddress = '0xAE28be68e2C37c2Cf7B4144cb83537Dbf48Ce8a5';
  balances: Array<AssetBalance> = [
    {
      icon: 'assets/img/coins/ETH.svg',
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0,
      usdAmount: 3000,
      usdSymbol: 'USD',
    },
  ];

  constructor(private walletService: WalletService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getWalletBalance();
  }

  getWalletBalance() {
    this.walletService.balanceOf(this.walletAddress).then((balance) => {
      this.balances[0].amount = this.totalBalanceWallet = parseFloat(balance);
    });
  }
}
