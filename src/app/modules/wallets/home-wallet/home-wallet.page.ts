import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar"> </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="wt__subheader__value">
        <div class="wt__title ux-font-text-base">
          <ion-text>
            {{ 'wallets.home.available_money' | translate }}
          </ion-text>
        </div>
        <div class="wt__amount ux-font-num-titulo">
          <ion-text>
            {{ this.totalBalanceWallet | number: '1.2-6' }}
            {{ this.currency }}
          </ion-text>
        </div>
      </div>
      <div [ngClass]="'wt__subheader'">
        <app-wallets-subheader *ngIf="this.haveWallets === false"></app-wallets-subheader>
      </div>
    </ion-content>`,
  styleUrls: ['./home-wallet.page.scss'],
})
export class HomeWalletPage implements OnInit {
  haveWallets = false;
  transactions: Array<any>;
  assets: Array<any>;
  totalBalanceWallet = 0;
  currency = 'USD';

  constructor() {}

  ngOnInit() {}
}
