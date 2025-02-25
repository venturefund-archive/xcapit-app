import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';

@Component({
  selector: 'app-receive-select-currency',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.receive_select_currency.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs ux_toolbar__step" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="sc ion-padding">
      <app-no-active-tokens-card *ngIf="!this.hasAssets" operation="receive"></app-no-active-tokens-card>
      <div class="content" *ngIf="this.hasAssets">
        <div class="sc__title">
          <ion-label class="ux-font-text-lg">
            {{ 'wallets.receive_select_currency.title' | translate }}
          </ion-label>
        </div>
        <div class="sc__list" *ngIf="this.coins">
          <app-token-selection-list
            state="receive"
            [userCoins]="this.coins"
            (clickedCoin)="this.selectCurrency($event)"
          ></app-token-selection-list>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./receive-select-currency.page.scss'],
})
export class ReceiveSelectCurrencyPage implements OnInit {
  coins: Coin[];
  hasAssets: boolean;
  constructor(private navController: NavController, private storageService: StorageService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storageService.getAssetsSelected().then((coins) => {
      this.coins = coins;
      this.hasAssets = this.coins.length > 0;
    });
  }

  selectCurrency(currency: Coin) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: currency.value,
        network: currency.network,
      },
    };

    this.navController.navigateForward(['/wallets/receive/detail'], navigationExtras);
  }
}
