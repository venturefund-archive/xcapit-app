import { Component, OnInit } from '@angular/core';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { NavController } from '@ionic/angular';
import { ApiWalletService } from '../../shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';

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
        <ion-label class="ux-font-text-lg">
          {{ 'wallets.send.select_currency.title' | translate }}
        </ion-label>
      </div>
      <div class="sc__list">
        <app-token-selection-list></app-token-selection-list>
      </div>
    </ion-content>
  `,
  styleUrls: ['./select-currency.page.scss'],
})
export class SelectCurrencyPage implements OnInit {
  coins: Coin[];
  constructor(private navController: NavController, private storageService: StorageService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storageService.getAssestsSelected().then((coins) => {
      this.coins = coins;
    });
  }

  selectCurrency(currency) {
    this.navController.navigateForward(['/wallets/send/detail', currency.value]);
  }
}
