import { Component, OnInit } from '@angular/core';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { LINKS } from '../../../../config/static-links';

@Component({
  selector: 'app-select-currency',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button appTrackClick name="ux_nav_go_back" defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.send.select_currency.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs ux_toolbar__step" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} 3</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="sc ion-padding">
      <app-no-active-tokens-card *ngIf="!this.hasAssets" operation="send"></app-no-active-tokens-card>
      <div class="content" *ngIf="this.hasAssets">
        <div class="sc__title">
          <ion-label class="ux-font-text-lg">
            {{ 'wallets.send.select_currency.title' | translate }}
          </ion-label>
        </div>
        <div class="sc__list" *ngIf="this.coins">
          <app-token-selection-list
            state="send"
            [userCoins]="this.coins"
            (clickedCoin)="this.selectCurrency($event)"
          ></app-token-selection-list>
        </div>
      </div>

      <div class="sc__require-token">
        <app-require-token
          [url]="this.staticLinks.requireToken"
          buttonEventName="ux_exp_addtoken_select"
        ></app-require-token>
      </div>
    </ion-content>
  `,
  styleUrls: ['./select-currency.page.scss'],
})
export class SelectCurrencyPage implements OnInit {
  coins: Coin[];
  hasAssets: boolean;
  staticLinks = LINKS;
  constructor(private navController: NavController, private storageService: StorageService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storageService.getAssetsSelected().then((coins) => {
      this.coins = coins;
      this.hasAssets = this.coins.length > 0;
    });
  }

  selectCurrency(token: Coin) {
    this.navController.navigateForward(['wallets/send/detail/blockchain', token.network, 'token', token.contract]);
  }
}
