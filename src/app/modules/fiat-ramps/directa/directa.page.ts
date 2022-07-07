import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { ProviderDataRepo } from '../shared-ramps/models/provider-data-repo/provider-data-repo';
import { HttpClient } from '@angular/common/http';

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
            [coinSelectorEnabled]="false"
          ></app-provider-new-operation-card>
        </div>

        <div class="ux_footer">
          <div class="ux_footer__content">
            <ion-text class="ux-font-text-xs ux_footer__content__disclaimer"
              >{{ 'fiat_ramps.shared.redirect_footer.text' | translate }}
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
    fiatAmount: ['', Validators.required],
  });
  provider: FiatRampProvider;
  countries = COUNTRIES;
  tokens: Coin[];
  selectedCurrency: Coin;
  fiatCurrency = 'USD';
  country: FiatRampProviderCountry;
  providerAlias: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private navController: NavController,
    private apiWalletService: ApiWalletService,
    private providers: ProvidersFactory,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.providerAlias = this.route.snapshot.paramMap.get('alias');
    this.provider = this.providers
      .create(new ProviderDataRepo(), this.http)
      .all()
      .find((provider) => provider.alias === this.providerAlias && provider.providerName === 'directa24');
    this.setCountry();
    this.setCurrency();
  }

  setCountry() {
    this.country = this.countries.find(
      (country) => country.name.toLowerCase() === this.route.snapshot.paramMap.get('country')
    );
  }

  setCurrency() {
    this.tokens = this.apiWalletService.getCoins();
    this.selectedCurrency = this.tokens.find((token) => token.value === 'USDC' && token.network === 'MATIC');
  }

  openD24() {
    return this.navController.navigateForward(['/tabs/wallets']);
  }
}
