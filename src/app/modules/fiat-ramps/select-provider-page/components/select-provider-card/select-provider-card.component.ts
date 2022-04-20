import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { COUNTRIES } from '../../../shared-ramps/constants/countries';
import { PROVIDERS } from '../../../shared-ramps/constants/providers';

@Component({
  selector: 'app-select-provider-card',
  template: `
    <div class="spc ion-padding-start ion-padding-end ion-padding-bottom">
      <div class="ux-card ion-padding">
        <div class="spc__select">
          <div class="spc__select__label-country">
            <ion-text class="ux-font-title-xs">{{ 'fiat_ramps.select_provider.select_label' | translate }}</ion-text>
          </div>
          <div>
            <app-input-select
              [modalTitle]="'fiat_ramps.select_provider.select_placeholder' | translate"
              [placeholder]="'fiat_ramps.select_provider.select_placeholder' | translate"
              controlName="country"
              [data]="this.countries"
              key="value"
              valueKey="value"
              [translated]="true"
              (selectedItem)="this.selectedCountry($event)"
              selectorStyle="modern"
            ></app-input-select>
          </div>
        </div>
        <div>
          <div class="spc__select__label-provider">
            <ion-text class="ux-font-title-xs">{{ 'fiat_ramps.select_provider.provider_label' | translate }}</ion-text>
          </div>
          <ion-radio-group [formControlName]="this.controlName">
            <div *ngFor="let provider of providers">
              <app-provider-card
                *ngIf="this.provider.showProvider || this.disabled === undefined"
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
  @Input() controlName = '';
  @Output() route: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  providers = PROVIDERS;
  countries = COUNTRIES;
  disabled: boolean;

  constructor() {}

  ngOnInit() {
    this.countries.sort(this.sortCountries);
  }

  selectedProvider(provider) {
    this.route.emit(provider.newOperationRoute);
  }

  selectedCountry(country) {
    this.onChange.emit();
    if (country) {
      this.disabled = true;
    }
    this.showProvider(country);
  }

  showProvider(country) {
    for (let provider of this.providers) {
      const show = provider.countries.includes(country.value);
      provider = Object.assign(provider, { showProvider: show });
    }
  }

  sortCountries(x, y) {
    return x.value.localeCompare(y.value);
  }
}
