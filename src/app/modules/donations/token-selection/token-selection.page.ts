import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { CAUSES } from '../shared-donations/constants/causes';

@Component({
  selector: 'app-token-selection',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left no-border">
        <ion-buttons slot="start">
          <ion-button class="dts__button_back" (click)="this.goBack()"> <ion-icon name="chevron-back-outline"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'donations.token_selection.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs dts__step_counter" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} 3</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="sc ion-padding">
      <div class="dts__title">
        <ion-label class="ux-font-text-lg">
          {{ 'donations.token_selection.title' | translate }}
        </ion-label>
      </div>
      <div class="dts__list" *ngIf="this.tplTokens">
        <app-token-selection-list
          state="swap"
          [userCoins]="this.tplTokens"
          (clickedCoin)="this.selectToken($event)"
        ></app-token-selection-list>
      </div>
    </ion-content>`,
  styleUrls: ['./token-selection.page.scss'],
})
export class TokenSelectionPage implements OnInit {
  cause: string;
  data;
  coins: Coin[];
  tplTokens: Coin[] = [];
  causes = structuredClone(CAUSES);
  constructor(
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.getCoins();
    this.cause = this.route.snapshot.queryParamMap.get('cause');
    this.data = this.causes.find((cause) => cause.id === this.cause);
    this.findTplTokens(this.data.addresses);
  }

  goBack() {
    this.navController.navigateBack(`/donations/description-cause?cause=${this.cause}`);
  }

  getCoins() {
    this.coins = this.apiWalletService.getCoins();
  }

  findTplTokens(addresses) {
    for (const address of addresses) {
      const tplToken = this.coins.find(
        (coin) => coin.value === address.token.value && coin.network === address.token.network
      );
      this.tplTokens.push(tplToken);
    }
  }

  selectToken(selectedCoin: Coin) {
    this.navController.navigateForward([
      'donations/send-donation/cause',
      this.data.id,
      'value',
      selectedCoin.value,
      'network',
      selectedCoin.network,
    ]);
  }
}
