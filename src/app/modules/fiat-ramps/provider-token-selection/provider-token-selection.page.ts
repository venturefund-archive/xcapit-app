import { Component, OnInit } from '@angular/core';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { PROVIDERS } from '../shared-ramps/constants/providers';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FiatRampCurrenciesOf } from '../shared-ramps/models/fiat-ramp-currencies-of/fiat-ramp-currencies-of';

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
  providers = PROVIDERS;
  provider: FiatRampProvider;
  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    const providerAlias = this.route.snapshot.paramMap.get('provider');
    this.provider = this.providers.find((provider) => provider.alias === providerAlias);
    this.availableCoins();
  }

  selectCurrency(currency: Coin) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: currency.value,
        network: currency.network,
      },
    };

    this.navController.navigateForward([`/fiat-ramps/new-operation/${this.provider.alias}`], navigationExtras);
  }

  async availableCoins() {
    this.coins =
      this.provider.alias === 'kripton'
        ? new FiatRampCurrenciesOf(this.provider, this.apiWalletService.getCoins()).value()
        : this.apiWalletService.getCoins().filter((coin) => Boolean(coin.moonpayCode));
  }
}
