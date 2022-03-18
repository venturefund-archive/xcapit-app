import { Component, OnInit } from '@angular/core';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-select-currency',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
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
      <div class="sc__list" *ngIf="this.coins">
        <app-token-selection-list state="send" [userCoins]="this.coins" (clickedCoin)="this.selectCurrency($event)"></app-token-selection-list>
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

  selectCurrency(currency: Coin) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: currency.value,
        network: currency.network
      },
    };
    
    this.navController.navigateForward(['/wallets/send/detail'], navigationExtras);
  }
}
