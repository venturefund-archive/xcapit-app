import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ProviderTokensOf } from '../shared-ramps/models/provider-tokens-of/provider-tokens-of';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { LINKS } from '../../../config/static-links';

@Component({
  selector: 'app-provider-token-selection',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'fiat_ramps.token_selection.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="sc ion-padding">
      <div class="sc__title">
        <ion-label class="ux-font-text-lg">
          {{ this.subtitle | translate }}
        </ion-label>
      </div>
      <div class="sc__list" *ngIf="this.coins">
        <app-token-selection-list
          [userCoins]="this.coins"
          state="buy"
          (clickedCoin)="this.selectCurrency($event)"
        ></app-token-selection-list>
      </div>

      <div class="sc__require-token">
        <app-require-token
          [url]="staticLinks.requireTokenBuy"
          buttonEventName="ux_exp_addtoken_buy"
        ></app-require-token>
      </div>
    </ion-content> `,
  styleUrls: ['./provider-token-selection.page.scss'],
})
export class ProviderTokenSelectionPage implements OnInit {
  coins: Coin[];
  staticLinks = LINKS;
  subtitle: string;
  constructor(
    private navController: NavController,
    private apiWalletService: ApiWalletService,
    private providersFactory: ProvidersFactory,
    private tokenOperationDataService: TokenOperationDataService,
    private fiatRampsService: FiatRampsService,
    private trackService: TrackService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.setSubtitle();
    this.availableCoins();
  }

  setSubtitle() {
    this.subtitle = `fiat_ramps.token_selection.${this.tokenOperationDataService.tokenOperationData.mode}_subtitle`;
  }

  selectCurrency(currency: Coin) {
    this.tokenOperationDataService.add({
      asset: currency.value,
      network: currency.network,
    });
    this.trackEvent(currency.value);
    this.navController.navigateForward('fiat-ramps/select-provider');
  }

  async availableCoins() {
    this.coins = await new ProviderTokensOf(
      this.providers(),
      this.apiWalletService.getCoins(),
      this.fiatRampsService
    ).all();
  }

  providers(): Providers {
    return this.providersFactory.create(this.tokenOperationDataService.tokenOperationData.mode);
  }

  trackEvent(currency: string) {
    this.trackService.trackEvent({
      eventAction: 'click',
      description: window.location.href,
      eventLabel: `ux_${this.tokenOperationDataService.tokenOperationData.mode}_${currency}`,
    });
  }
}
