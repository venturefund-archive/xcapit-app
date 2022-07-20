import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { COUNTRIES } from '../../../shared-ramps/constants/countries';
import { ProvidersFactory } from '../../../shared-ramps/models/providers/factory/providers.factory';
import { FiatRampProvider } from '../../../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { FiatRampProviderCountry } from '../../../shared-ramps/interfaces/fiat-ramp-provider-country';

@Component({
  selector: 'app-select-provider-card',
  template: `
    <div class="spc ion-padding-start ion-padding-end ion-padding-bottom">
      <div class="ux-card ion-padding">
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
        <div>
          <div class="spc__select__label-provider">
            <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.select_provider.provider_label' | translate }}</ion-text>
          </div>
          <ion-radio-group [formControlName]="this.controlNameProvider">
            <div *ngFor="let provider of availableProviders">
              <app-provider-card
                [disabled]="this.disabled"
                [provider]="provider"
                (selectedProvider)="this.selectedProvider($event)"
              ></app-provider-card>
            </div>
          </ion-radio-group>
        </div>
        <div>
          <ion-text class="ux-font-text-xxs">
            {{ 'fiat_ramps.select_provider.disclaimer' | translate }}
          </ion-text>
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
  @Output() route: EventEmitter<any> = new EventEmitter<any>();
  @Output() changedCountry: EventEmitter<any> = new EventEmitter<any>();
  form: UntypedFormGroup;
  countries = COUNTRIES;
  disabled = true;
  availableProviders: FiatRampProvider[];
  constructor(private formGroupDirective: FormGroupDirective, private providersFactory: ProvidersFactory) {}

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
    this.availableProviders = await this.providers().availablesBy(country);
    this.disabled = false;
  }

  sortCountries() {
    this.countries.sort((x, y) => x.value.localeCompare(y.value));
  }

  providers() {
    return this.providersFactory.create();
  }
}
