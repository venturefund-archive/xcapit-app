import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

@Component({
  selector: 'app-provider-token-selection',
  template: `<ion-header>
  <ion-toolbar color="primary" class="ux_toolbar">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
    </ion-buttons>
    <ion-title class="ion-text-center">{{ 'fiat_ramps.token_selection.header' | translate }}</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content class="sc ion-padding">
  <div class="sc__title">
    <ion-label class="ux-font-text-lg">
      {{ 'fiat_ramps.token_selection.subtitle' | translate }}
    </ion-label>
  </div>
  <div class="sc__list" *ngIf="this.coins">
    <app-token-selection-list [userCoins]="this.coins" (clickedCoin)="this.selectCurrency($event)"></app-token-selection-list>
  </div>
</ion-content>
  `,
  styleUrls: ['./provider-token-selection.page.scss'],
})
export class ProviderTokenSelectionPage implements OnInit { 
    coins: Coin[];
    constructor(private navController: NavController, private storageService: StorageService) {}
  
    ngOnInit() {}
  
    ionViewWillEnter() {
      this.storageService.getAssestsSelected().then((coins) => {
        this.coins = coins.filter((coin) => Boolean(coin.moonpayCode));
      });
    }
  
    selectCurrency(currency: Coin) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          asset: currency.value,
          network: currency.network
        },
      };
      
      this.navController.navigateForward(['/fiat-ramps/moonpay'], navigationExtras);
    }
}
