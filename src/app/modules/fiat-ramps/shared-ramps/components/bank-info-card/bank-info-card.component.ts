import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
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
              <ion-text class="ux-font-text-base-black bic__content__item__container__content__amount">
                $ {{ this.operation.amount_in | number: '1.2-8' }} {{ this.operation.currency_in.toUpperCase() }}
              </ion-text>
            </div>
          </div>
          <ion-button class="ion-no-margin" name="ux_copy_amount" fill="clear" size="small" (click)="this.copyAmountToClipboard()">
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
              <ion-text class="ux-font-text-base-black bic__content__item__container__content__bank">
                {{ this.bankInfo.name }}
              </ion-text>
            </div>
          </div>
        </div>
        <div *ngIf="this.bankInfo">
          <div class="bic__content__item" *ngFor="let extra of this.bankInfo.extras; let i = index">
            <div class="bic__content__item__container">
              <div class="bic__content__item__container__header">
                <ion-text class="ux-font-titulo-xs bic__content__item__container__header__extra-key">
                  {{ extra.key }}
                </ion-text>
              </div>
              <div class="bic__content__item__container__content">
                <ion-text class="ux-font-text-base-black">
                  {{ extra.value }}
                </ion-text>
              </div>
            </div>
            <ion-button class="ion-no-margin" fill="clear" name="ux_copy_extra" size="small" (click)="this.copyExtraDataToClipboard(i)">
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
              <ion-text class="ux-font-text-base-black bic__content__item__container__content__concept">
                {{ this.concept }}
              </ion-text>
            </div>
          </div>
          <ion-button class="ion-no-margin" fill="clear" name="ux_copy_concept" size="small" (click)="this.copyConceptToClipboard()">
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
  concept = "Cash In";

  constructor(
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService,
  ) {}

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

  copyAmountToClipboard() {
    this.copyDataToClipboard(this.operation.amount_in.toString());
  }

  copyExtraDataToClipboard(index: number) {
    this.copyDataToClipboard(this.bankInfo.extras[index].value);
  }

  copyConceptToClipboard() {
    this.copyDataToClipboard(this.concept);
  }

  private copyDataToClipboard(data: string) {
    this.clipboardService.write({ string: data }).then(() => {
      this.toastService.showSuccessToast({
        message: this.translate.instant('fiat_ramps.operation_detail.bank_info_card.copy_success_text')
      })
    });
  }
}
