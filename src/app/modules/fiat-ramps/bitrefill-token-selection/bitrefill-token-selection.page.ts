import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';

@Component({
  selector: 'app-bitrefill-token-selection',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left ux_toolbar__rounded no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'fiat_ramps.bitrefill.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="bts">
      <ion-label class="ux-font-text-lg">{{ 'fiat_ramps.bitrefill.token_selection.title' | translate }}</ion-label>
      <div class="bts__tokens" *ngIf="this.tplTokens">
        <app-token-selection-list
          state="swap"
          [userCoins]="this.tplTokens"
          (clickedCoin)="this.selectToken($event)"
        ></app-token-selection-list>
      </div>
    </ion-content>`,
  styleUrls: ['./bitrefill-token-selection.page.scss'],
})
export class BitrefillTokenSelectionPage {
  tplTokens: Coin[] = [];
  availablePaymentMethods = [];

  constructor(
    private navController: NavController,
    private apiWalletService: ApiWalletService,
    private remoteConfig: RemoteConfigService
  ) {}

  async ionViewWillEnter() {
    this.setAvailablePaymentMethods();
    this.setTokens();
  }

  setAvailablePaymentMethods() {
    this.availablePaymentMethods = this.remoteConfig.getObject('bitrefill_payment_methods');
  }

  setTokens() {
    const tokens = this.apiWalletService.getCoins();
    for (const paymentMethod of this.availablePaymentMethods) {
      const availableToken = tokens.find((t) => t.value === paymentMethod.value && t.network === paymentMethod.network);
      if (availableToken) {
        this.tplTokens.push(availableToken);
      }
    }
  }

  selectToken(selectedCoin: Coin) {
    const selectedPaymentMethod = this.availablePaymentMethods.find(
      (paymentMethod) => paymentMethod.value == selectedCoin.value && paymentMethod.network == selectedCoin.network
    );
    this.navController.navigateForward(['fiat-ramps/bitrefill/purchase', selectedPaymentMethod.code]);
  }

  ionViewWillLeave() {
    this.tplTokens = [];
  }
}
