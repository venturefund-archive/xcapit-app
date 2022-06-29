import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { PROVIDERS } from '../shared-ramps/constants/providers';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { FiatRampCurrenciesOf } from '../shared-ramps/models/fiat-ramp-currencies-of/fiat-ramp-currencies-of';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';

@Component({
  selector: 'app-directa',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/select-provider"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.new_operation.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="this.form" class="ux_main">
        <div class="ux_content aon">
          <app-provider-new-operation-card
            *ngIf="this.selectedCurrency"
            [coin]="this.selectedCurrency"
            [fiatCurrency]="this.fiatCurrency"
            [provider]="this.provider"
            [amountEnabled]="false"
            [amountUSDEnabled]="true"
            [coinSelectorEnabled]="false"
          ></app-provider-new-operation-card>
        </div>

        <div class="ux_footer">
          <div class="ux_footer__content">
            <ion-text class="ux-font-text-xs ux_footer__content__disclaimer">{{
              'fiat_ramps.shared.redirect_footer.text' | translate 
            }}
            </ion-text>
          </div>
          <div class="button-next">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Continue"
              type="submit"
              color="secondary"
              size="large"
              [disabled]="!this.form.valid"
              (click)="this.openD24()"
            >
              {{ 'fiat_ramps.new_operation.next_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./directa.page.scss'],
})
export class DirectaPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    usdAmount: ['', Validators.required],
  });
  provider: FiatRampProvider;
  providers: FiatRampProvider[] = PROVIDERS;
  providerCurrencies: Coin[];
  selectedCurrency: Coin;
  fiatCurrency: string = 'USD';
  country: FiatRampProviderCountry;
  providerAlias: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private fiatRampsService: FiatRampsService,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
  ) { }

  ngOnInit() {}

  ionViewWillEnter() { 
    this.providerAlias = this.route.snapshot.paramMap.get('alias')
    this.provider = this.providers.find((provider) => provider.alias === this.providerAlias);
    console.log('El proveedor obtenido desde el alias es: ', this.providerAlias, ' y ', this.provider)
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.providerCurrencies = new FiatRampCurrenciesOf(this.provider, this.apiWalletService.getCoins()).value();
    this.setCountry();
    this.setCurrency();
  }

  setCountry() {
    this.country = COUNTRIES.find(
      (country) => country.name.toLowerCase() === this.route.snapshot.paramMap.get('country')
    );
  }

  setCurrency() {
    this.selectedCurrency = this.providerCurrencies[0];
  }

  openD24() {
    return this.navController.navigateForward(['/tabs/wallets']);  
  }
}
