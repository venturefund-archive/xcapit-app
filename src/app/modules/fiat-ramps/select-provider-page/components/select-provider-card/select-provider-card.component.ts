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
import { DefaultKriptonPriceFactory } from '../../../shared-ramps/models/kripton-dynamic-price/factory/default-kripton-price-factory';
import { DefaultMoonpayPriceFactory } from '../../../shared-ramps/models/moonpay-price/factory/default-moonpay-price-factory';

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
        <div class="spc__select__label-provider" *ngIf="this.availableProviders.length">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.select_provider.provider_label' | translate }}</ion-text>
        </div>
        <ion-radio-group [formControlName]="this.controlNameProvider">
          <div *ngFor="let provider of availableProviders">
            <app-provider-card
              [disabled]="this.disabled"
              [provider]="provider"
              [fiatCode]="this.country.isoCodeAlpha3"
              [tokenValue]="this.coin.value"
              (selectedProvider)="this.selectedProvider($event)"
            ></app-provider-card>
          </div>
        </ion-radio-group>
        <div class="spc__no_providers" *ngIf="!this.availableProviders.length">
          <img src="assets/img/fiat-ramps/select-provider/no-providers.svg" />
          <ion-text class="ux-font-text-xxs" color="neutral80">{{
            'fiat_ramps.select_provider.no_provider' | translate: { coinName: this.coin.value }
          }}</ion-text>
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
  @Output() route: EventEmitter<any> = new EventEmitter<any>();
  @Output() changedCountry: EventEmitter<any> = new EventEmitter<any>();
  form: UntypedFormGroup;
  countries = COUNTRIES;
  disabled = true;
  availableProviders: FiatRampProvider[];
  directaQuote: number;
  kriptonQuote: number;
  country: FiatRampProviderCountry;
  constructor(
    private formGroupDirective: FormGroupDirective,
    private providersFactory: ProvidersFactory,
    private directaPriceFactory: DefaultDirectaPriceFactory,
    private kriptonPriceFactory: DefaultKriptonPriceFactory,
    private moonpayFactory: DefaultMoonpayPriceFactory,
    private http: HttpClient,
    private fiatRampsService: FiatRampsService
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
    const params = provider.providerName === 'directa24' ? provider.alias : '';
    this.route.emit(`${provider.newOperationRoute}/${params}`);
  }

  async selectedCountry(country: FiatRampProviderCountry) {
    this.changedCountry.emit();
    this.availableProviders = await this.providers().availablesBy(country, this.coin);
    this.country = country;
    this.disabled = false;
    await this.setProvidersQuote();
    this.setQuoteValues();
    this.setBestQuoteByProvider();
    console.log(this.availableProviders);
  }

  sortCountries() {
    this.countries.sort((x, y) => x.value.localeCompare(y.value));
  }

  providers() {
    return this.providersFactory.create();
  }

  async setDirectaQuote(fiatCode: string) {
    this.directaQuote = await this.directaPriceFactory
      .new(fiatCode, this.coin, this.fiatRampsService)
      .value()
      .toPromise();
  }
  async setKriptonQuote(fiatCode: string) {
    this.kriptonQuote = await this.kriptonPriceFactory.new(fiatCode, this.coin, this.http).value().toPromise();
  }

  async setProvidersQuote() {
    await this.setDirectaQuote(this.country.isoCurrencyCodeDirecta);
    await this.setKriptonQuote(this.country.fiatCode ? this.country.fiatCode : 'USD');
  }

  getBestProvider() {
    let bestProvider: FiatRampProvider = null;
    for (const provider of this.availableProviders) {
      if (!bestProvider) {
        bestProvider = provider;
      } else if (provider.quote < bestProvider.quote) {
        bestProvider = provider;
      }
    }
    return bestProvider;
  }

  moreThanOneBestQuote() {
    const bestProviderQuote = this.getBestProvider().quote;
    const isMoreThanOne =  this.availableProviders.filter(provider => provider.quote === bestProviderQuote);
    return isMoreThanOne.length > 1;
  }

  setBestQuoteByProvider() {
    if(!this.moreThanOneBestQuote()){
      const bestProvider = this.getBestProvider();
      this.availableProviders = this.availableProviders.map((provider) => {
        provider.isBestQuote = provider.id === bestProvider.id;
        return provider;
      });
    }
  }

  setQuoteValues() {
    this.availableProviders = this.availableProviders.map((provider) => {
      if (provider.providerName === 'directa24') {
        provider.quote = this.directaQuote;
      } else if (provider.providerName === 'kripton') {
        provider.quote = this.kriptonQuote;
      }
      return provider;
    });
  }
}
