import { Component, OnInit } from '@angular/core';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ProviderTokensOf } from '../shared-ramps/models/provider-tokens-of/provider-tokens-of';
import { HttpClient } from '@angular/common/http';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { RemoteConfigService } from '../../../shared/services/remote-config/remote-config.service';

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
        <app-token-selection-list
          [userCoins]="this.coins"
          state="buy_moonpay"
          (clickedCoin)="this.selectCurrency($event)"
        ></app-token-selection-list>
      </div>
    </ion-content> `,
  styleUrls: ['./provider-token-selection.page.scss'],
})
export class ProviderTokenSelectionPage implements OnInit {
  coins: Coin[];
  provider: FiatRampProvider;
  country: string;
  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService,
    private http: HttpClient,
    private providersFactory: ProvidersFactory,
    private remoteConfig: RemoteConfigService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    const providerAlias = this.route.snapshot.paramMap.get('provider');
    this.country = this.route.snapshot.queryParamMap.get('country');
    this.provider = this.providers().byAlias(providerAlias);
    this.availableCoins();
  }

  selectCurrency(currency: Coin) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        country: this.country,
        asset: currency.value,
        network: currency.network,
      },
    };

    this.navController.navigateForward([`/fiat-ramps/new-operation/${this.provider.alias}`], navigationExtras);
  }

  async availableCoins() {
    this.coins = new ProviderTokensOf(this.providers(), this.apiWalletService.getCoins()).byAlias(this.provider.alias);
  }

  providers(): Providers {
    return this.providersFactory.create(this.remoteConfig, this.http);
  }
}
