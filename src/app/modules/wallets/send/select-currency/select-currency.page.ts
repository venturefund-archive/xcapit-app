import { Component, OnInit } from '@angular/core';
import { COINS } from '../../constants/coins';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { NavController } from '@ionic/angular';

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
        <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24">
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
  coins: Coin[] = COINS;
  constructor(private navController: NavController) {}

  ngOnInit() {}

  selectCurrency(currency) {
    this.navController.navigateForward(['/wallets/send/detail', currency.value]);
  }
}
