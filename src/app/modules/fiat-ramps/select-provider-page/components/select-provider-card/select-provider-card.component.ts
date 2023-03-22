import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { COUNTRIES } from '../../../shared-ramps/constants/countries';
import { ProvidersFactory } from '../../../shared-ramps/models/providers/factory/providers.factory';
import { FiatRampProvider } from '../../../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { FiatRampProviderCountry } from '../../../shared-ramps/interfaces/fiat-ramp-provider-country';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampsService } from '../../../shared-ramps/services/fiat-ramps.service';
import { HttpClient } from '@angular/common/http';
import { DefaultDirectaPriceFactory } from '../../../shared-ramps/models/directa-price/factory/default-directa-price-factory';
import { DefaultKriptonPriceFactory } from '../../../shared-ramps/models/kripton-price/factory/default-kripton-price-factory';
import { DefaultMoonpayPriceFactory } from '../../../shared-ramps/models/moonpay-price/factory/default-moonpay-price-factory';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Component({
  selector: 'app-select-provider-card',
  template: `
    <div class="spc ion-padding-start ion-padding-end ion-padding-bottom">
      <div class="spc__select">
        <div class="spc__select__label-country">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.select_provider.select_label' | translate }}</ion-text>
        </div>
        <div>
          <app-input-select
            [modalTitle]="'fiat_ramps.select_provider.select_placeholder' | translate"
            [placeholder]="'fiat_ramps.select_provider.select_placeholder' | translate"
            [controlName]="this.controlNameSelect"
            [data]="this.countries"
            key="value"
            valueKey="value"
            [translated]="true"
            selectorStyle="modern"
          ></app-input-select>
        </div>
      </div>
      <div class="spc__providers" *ngIf="!this.disabled">
        <div class="spc__select__label-provider" *ngIf="this.availableProviders.length && this.txMode !== 'sell'">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.select_provider.provider_label' | translate }}</ion-text>
        </div>
        <ion-radio-group
          class="spc__providers__radio-group"
          [formControlName]="this.controlNameProvider"
          [value]="this.bestProvider"
        >
          <ion-text
            *ngIf="this.fiatProviders.length > 0 && this.txMode !== 'sell'"
            class="ux-font-text-xxs spc__providers__radio-group__label"
            >{{ 'fiat_ramps.select_provider.pay_in_fiat' | translate }}</ion-text
          >
          <ion-text
            *ngIf="this.fiatProviders.length > 0 && this.txMode === 'sell'"
            class="ux-font-text-lg spc__providers__radio-group__label"
            >{{ '¿Qué método de cobro prefieres?' | translate }}</ion-text
          >
          <div *ngFor="let provider of fiatProviders">
            <app-provider-card
              [disabled]="this.disabled"
              [provider]="provider"
              [selectedCountry]="this.country"
              [fiatCode]="this.country.iso4217CurrencyCode"
              [tokenValue]="this.coin.value"
              (selectedProvider)="this.selectedProvider($event)"
              [txMode]="this.txMode"
            ></app-provider-card>
          </div>
          <ion-text
            *ngIf="this.usdProviders.length > 0 && this.txMode !== 'sell'"
            class="ux-font-text-xxs spc__providers__radio-group__label"
            >{{ 'fiat_ramps.select_provider.pay_in_usd' | translate }}</ion-text
          >
          <div *ngFor="let provider of usdProviders">
            <app-provider-card
              [disabled]="this.disabled"
              [provider]="provider"
              [fiatCode]="'USD'"
              [tokenValue]="this.coin.value"
              [selectedCountry]="this.country"
              (selectedProvider)="this.selectedProvider($event)"
              [txMode]="this.txMode"
            ></app-provider-card>
          </div>
        </ion-radio-group>
        <div class="spc__no_providers" *ngIf="!this.availableProviders.length">
          <img src="assets/img/fiat-ramps/select-provider/no-providers.svg" />
          <ion-text class="ux-font-text-xxs" color="neutral80">{{
            'fiat_ramps.select_provider.no_provider' | translate : { coinName: this.coin.value }
          }}</ion-text>
        </div>
        <div class="spc__disclaimer" *ngIf="this.availableProviders.length && this.txMode !== 'sell'">
          <ion-text class="ux-font-text-xs"> {{ 'fiat_ramps.select_provider.disclaimer' | translate }} </ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./select-provider-card.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class SelectProviderCardComponent implements OnInit {
  @Input() controlNameProvider = '';
  @Input() controlNameSelect = '';
  @Input() coin: Coin;
  @Input() txMode: string;
  @Output() route: EventEmitter<any> = new EventEmitter<any>();
  @Output() changedCountry: EventEmitter<any> = new EventEmitter<any>();
  form: UntypedFormGroup;
  countries = COUNTRIES;
  disabled = true;
  availableProviders: FiatRampProvider[];
  usdProviders: FiatRampProvider[] = [];
  fiatProviders: FiatRampProvider[] = [];
  bestProvider: FiatRampProvider;
  directaQuote: number;
  kriptonQuote: number;
  moonpayUsdQuote: number;
  country: FiatRampProviderCountry;
  constructor(
    private formGroupDirective: FormGroupDirective,
    private providersFactory: ProvidersFactory,
    private directaPriceFactory: DefaultDirectaPriceFactory,
    private kriptonPriceFactory: DefaultKriptonPriceFactory,
    private moonpayFactory: DefaultMoonpayPriceFactory,
    private http: HttpClient,
    private fiatRampsService: FiatRampsService,
    private remoteConfig: RemoteConfigService
  ) {}

  ngOnInit() {
    this.countries = this.availableCountries();
    this.form = this.formGroupDirective.form;
    this.sortCountries();
    this.availableProviders = this.providers().all();
    this.form.get('country').valueChanges.subscribe((value) => this.selectedCountry(value));
  }

  availableCountries(): any {
    const providerCountries = [];
    this.providers()
      .all()
      .forEach((provider) => providerCountries.push(...provider.countries));
    return this.countries.filter((country) => providerCountries.includes(country.name));
  }

  selectedProvider(provider) {
    let params = '';
    switch (provider.providerName) {
      case 'directa24':
        params = provider.alias;
        break;
      case 'bitrefill':
        params = this.bitrefillCode();
        break;
      default:
        params = '';
        break;
    }
    this.route.emit(`${provider.newOperationRoute}/${params}`);
  }

  bitrefillCode() {
    const availableBitrefillPaymentMethods = this.remoteConfig.getObject('bitrefill_payment_methods');
    return availableBitrefillPaymentMethods.find(
      (abpm) => abpm.value === this.coin.value && abpm.network === this.coin.network
    ).code;
  }

  async selectedCountry(country: FiatRampProviderCountry) {
    this.changedCountry.emit();
    this.resetProviders();
    this.availableProviders = await this.providers().availablesBy(country, this.coin);
    this.country = country;
    this.sliceProviders();
    this.disabled = false;
    await this.setProvidersQuote();
    this.setQuoteValues();
    this.setBestQuoteByProvider();
  }

  sortCountries() {
    this.countries.sort((x, y) => x.value.localeCompare(y.value));
  }

  providers() {
    return this.providersFactory.create(this.txMode);
  }

  async setDirectaQuote(fiatCode: string) {
    if (fiatCode && this.coin.value === 'USDC') {
      return await this.directaPriceFactory.new(fiatCode, this.coin, this.fiatRampsService).value().toPromise();
    }
    return null;
  }
  async setKriptonQuote(fiatCode: string) {
    if (fiatCode && this.availableProviders.some((p) => p.alias === 'kripton')) {
      return await this.kriptonPriceFactory.new(fiatCode, this.coin, 'cash-in', this.http).value().toPromise();
    }
    return null;
  }

  async setMoonpayQuote(fiatCode: string) {
    if (!fiatCode) {
      fiatCode = 'USD';
    }
    if (fiatCode && this.availableProviders.some((p) => p.alias === 'moonpay')) {
      return await this.moonpayFactory.new(fiatCode, this.coin.moonpayCode, this.fiatRampsService).value().toPromise();
    }
    return null;
  }

  async setProvidersQuote() {
    this.directaQuote = await this.setDirectaQuote(this.country.isoCurrencyCodeDirecta);
    this.kriptonQuote = await this.setKriptonQuote(this.country.fiatCode);
    this.moonpayUsdQuote = await this.setMoonpayQuote(this.country.isoCurrencyCodeMoonpay);
  }

  resetProviders() {
    this.fiatProviders = [];
    this.usdProviders = [];
  }

  isUsdFiatQuote() {
    return Boolean(this.country.isoCurrencyCodeMoonpay);
  }

  sliceProviders() {
    if (!this.isUsdFiatQuote()) {
      for (const provider of this.availableProviders) {
        provider.alias === 'moonpay' ? this.usdProviders.push(provider) : this.fiatProviders.push(provider);
      }
    } else {
      this.fiatProviders = this.availableProviders;
    }
  }

  getBestProvider() {
    let bestProvider: FiatRampProvider = this.fiatProviders[0] || null;
    for (const provider of this.fiatProviders) {
      if (provider.quote < bestProvider.quote) {
        bestProvider = provider;
      }
    }
    return bestProvider;
  }

  moreThanOneBestQuote() {
    const bestProviderQuote = this.getBestProvider().quote;
    const isMoreThanOne = this.fiatProviders.filter((provider) => provider.quote === bestProviderQuote);
    return isMoreThanOne.length > 1;
  }

  setBestQuoteByProvider() {
    if (this.fiatProviders.length > 0 && !this.moreThanOneBestQuote()) {
      const bestProvider = this.getBestProvider();
      this.fiatProviders = this.fiatProviders.map((provider) => {
        provider.isBestQuote = provider.id === bestProvider.id;
        return provider;
      });
      this.form.get('provider').setValue(bestProvider);
      this.selectedProvider(bestProvider);
      this.bestProvider = bestProvider;
    }
  }

  setQuoteValues() {
    this.availableProviders = this.availableProviders.map((provider) => {
      if (provider.providerName === 'directa24') {
        provider.quote = this.directaQuote;
      } else if (provider.providerName === 'kripton') {
        provider.quote = this.kriptonQuote;
      } else if (provider.providerName === 'moonpay') {
        this.isUsdFiatQuote() ? (provider.usdQuote = this.moonpayUsdQuote) : (provider.quote = this.moonpayUsdQuote);
      }
      return provider;
    });
  }
}
