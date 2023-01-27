import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FiatRampOperation } from '../../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { COUNTRIES } from '../../shared-ramps/constants/countries';
import { TokenOperationDataService } from '../../shared-ramps/services/token-operation-data/token-operation-data.service';
@Component({
  selector: 'app-select-provider',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/token-selection"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'fiat_ramps.select_provider.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="ux_content">
          <form [formGroup]="this.form">
            <app-select-provider-card
              (route)="this.receiveRoute($event)"
              (changedCountry)="this.resetForm()"
              controlNameProvider="provider"
              controlNameSelect="country"
              [coin]="this.coin"
            ></app-select-provider-card>
          </form>
        </div>
      </div>
    </ion-content>
    <ion-footer class="sp__footer">
      <div class="ux_footer ion-padding">
        <ion-button
          class="ux_button"
          appTrackClick
          name="ux_vendor_buy_continue"
          color="secondary"
          size="large"
          expand="block"
          (click)="this.goToRoute()"
          [disabled]="!this.form.valid"
        >
          {{ 'fiat_ramps.select_provider.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./select-provider.page.scss'],
})
export class SelectProviderPage {
  form: UntypedFormGroup = this.formBuilder.group({
    country: ['', [Validators.required]],
    provider: ['', [Validators.required]],
  });
  newOperationRoute: string;
  disabled: boolean;
  coin: Coin;
  operationsList: FiatRampOperation[];
  countries = COUNTRIES;
  constructor(
    private navController: NavController,
    private formBuilder: UntypedFormBuilder,
    private trackService: TrackService,
    private apiWalletService: ApiWalletService,
    private tokenOperationDataService: TokenOperationDataService
  ) {}

  ionViewWillEnter() {
    this.trackScreenViewEvent();
  }

  ionViewDidEnter() {
    this.checkSelectedCountry();
  }

  checkSelectedCountry() {
    if (this.tokenOperationDataService.tokenOperationData.country)
      this.form
        .get('country')
        .setValue(
          this.countries.find(
            (country) => country.isoCodeAlpha3 === this.tokenOperationDataService.tokenOperationData.country
          )
        );
  }

  trackScreenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_screenview_buy',
    });
    const { asset, network } = this.tokenOperationDataService.tokenOperationData;
    this.coin = this.apiWalletService.getCoin(asset, network);
  }

  receiveRoute(route: string) {
    this.newOperationRoute = route;
  }

  goToRoute() {
    this.tokenOperationDataService.tokenOperationData.country = this.form.value.country.isoCodeAlpha3;
    this.navController.navigateForward([this.newOperationRoute]);
  }

  resetForm() {
    this.form.get('provider').reset();
  }
}
