import { Component, OnInit } from '@angular/core';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { NavController } from '@ionic/angular';
import { ApiWalletService } from '../../shared-wallets/services/api-wallet/api-wallet.service';

@Component({
  selector: 'app-select-currency',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.send.select_currency.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="sc ion-padding">
      <div class="sc__title">
        <ion-text class="ux-font-text-lg">
          {{ 'wallets.send.select_currency.title' | translate }}
        </ion-text>
      </div>
      <div class="sc__list">
        <app-ux-list-card
          (itemClicked)="this.selectCurrency($event)"
          [data]="this.coins"
          iconName="logoRoute"
          labelName="name"
        ></app-ux-list-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./select-currency.page.scss'],
})
export class SelectCurrencyPage implements OnInit {
  coins: Coin[];
  constructor(private navController: NavController, private apiWalletService: ApiWalletService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.coins = this.apiWalletService.getCoins();
  }

  selectCurrency(currency) {
    this.navController.navigateForward(['/wallets/send/detail', currency.value]);
  }
}
