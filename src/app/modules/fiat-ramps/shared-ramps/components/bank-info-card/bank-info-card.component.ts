import { Component, Input, OnInit } from '@angular/core';
import { BANK_INFO_KRIPTON } from '../../constants/bank-info-kripton';
import { COUNTRIES } from '../../constants/countries';
import { BankInfo } from '../../interfaces/bank-info.interface';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { FiatRampProviderCountry } from '../../interfaces/fiat-ramp-provider-country';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';

@Component({
  selector: 'app-bank-info-card',
  template: `
    <ion-card class="ux-card-new ion-no-margin bic">
      <div class="bic__header">
        <ion-text class="ux-font-text-lg">
          {{ 'fiat_ramps.operation_detail.bank_info_card.header' | translate }}
        </ion-text>
      </div>
      <div class="bic__content">
        <div class="bic__content__item">
          <div class="bic__content__item__container">
            <div class="bic__content__item__container__header">
              <ion-text class="ux-font-titulo-xs">
                {{ 'fiat_ramps.operation_detail.bank_info_card.amount' | translate }}
              </ion-text>
            </div>
            <div class="bic__content__item__container__content">
              <ion-text class="ux-font-text-base-black">
                $ {{ this.operation.amount_in | number: '1.2-8' }} {{ this.operation.currency_in.toUpperCase() }}
              </ion-text>
            </div>
          </div>
          <ion-button class="ion-no-margin" fill="clear" size="small">
            <ion-icon name="ux-paste"></ion-icon>
          </ion-button>
        </div>
        <div class="bic__content__item">
          <div class="bic__content__item__container">
            <div class="bic__content__item__container__header">
              <ion-text class="ux-font-titulo-xs">
                {{ 'fiat_ramps.operation_detail.bank_info_card.bank' | translate }}
              </ion-text>
            </div>
            <div class="bic__content__item__container__content">
              <ion-text class="ux-font-text-base-black">
                {{ this.bankInfo.name }}
              </ion-text>
            </div>
          </div>
        </div>
        <div *ngIf="this.bankInfo">
          <div class="bic__content__item" *ngFor="let extra of this.bankInfo.extras">
            <div class="bic__content__item__container">
              <div class="bic__content__item__container__header">
                <ion-text class="ux-font-titulo-xs">
                  {{ extra.key }}
                </ion-text>
              </div>
              <div class="bic__content__item__container__content">
                <ion-text class="ux-font-text-base-black">
                  {{ extra.value }}
                </ion-text>
              </div>
            </div>
            <ion-button class="ion-no-margin" fill="clear" size="small">
              <ion-icon name="ux-paste"></ion-icon>
            </ion-button>
          </div>
        </div>
        <div class="bic__content__item">
          <div class="bic__content__item__container">
            <div class="bic__content__item__container__header">
              <ion-text class="ux-font-titulo-xs">
                {{ 'fiat_ramps.operation_detail.bank_info_card.concept' | translate }}
              </ion-text>
            </div>
            <div class="bic__content__item__container__content">
              <ion-text class="ux-font-text-base-black">Cash In</ion-text>
            </div>
          </div>
          <ion-button class="ion-no-margin" fill="clear" size="small">
            <ion-icon name="ux-paste"></ion-icon>
          </ion-button>
        </div>
      </div>
    </ion-card>
  `,
  styleUrls: ['./bank-info-card.component.scss'],
})
export class BankInfoCardComponent implements OnInit {
  @Input() provider: FiatRampProvider;
  @Input() operation: FiatRampOperation;
  country: FiatRampProviderCountry;
  allBanks = BANK_INFO_KRIPTON;
  countries = COUNTRIES;
  bankInfo: BankInfo;

  constructor() {}

  ngOnInit() {
    this.getCountry();
    this.getBankInfo();
  }

  private getCountry() {
    this.country = this.countries.find(
      (c) => c.fiatCode && c.fiatCode.toUpperCase() === this.operation.currency_in.toUpperCase()
    );
  }

  private getBankInfo() {
    this.bankInfo = this.allBanks.find(
      (b) => b.providerId === this.provider.id && b.countryIsoCode === this.country.isoCode
    );
  }
}
