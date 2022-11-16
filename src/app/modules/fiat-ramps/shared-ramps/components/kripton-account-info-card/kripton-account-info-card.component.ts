import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KRIPTON_ACCOUNT_INFO } from '../../constants/kripton-account-info';

@Component({
  selector: 'app-kripton-account-info-card',
  template: `<div class="kaic">
    <ion-label class="kaic__title ux-font-text-lg">{{
      'fiat_ramps.shared.kripton_account_info.title' | translate
    }}</ion-label>
    <div class="kaic__details">
      <div class="kaic__details__amount">
        <img
          class="kaic__details__amount__country-flag"
          [src]="'/assets/img/purchase-order/' + this.country + '-flag.svg'"
        />
        <div class="kaic__details__amount__currency">
          <ion-label class="ux-font-header-titulo">{{ this.currency }}</ion-label>
          <ion-label class="ux-font-text-xs">{{
            'fiat_ramps.shared.kripton_account_info.currency_type.' + this.country | translate
          }}</ion-label>
        </div>
        <ion-label class="kaic__details__amount__value ux-font-header-titulo">{{'$'}}{{ this.amount | formattedAmount: 10:2 }}</ion-label>
        <img
          class="copy-icon-amount"
          (click)="this.copyToClipboard(this.amount, 'fiat_ramps.shared.kripton_account_info.amount')"
          src="/assets/img/purchase-order/copy.svg"
        />
      </div>
      <div class="kaic__details__item">
        <div class="kaic__details__item__data">
          <ion-label class="alias-title ux-font-titulo-xs">{{
            'fiat_ramps.shared.kripton_account_info.alias' | translate
          }}</ion-label>
          <ion-label class="alias kaic__details__item__data__value ux-font-text-base">{{
            this.kriptonAccountInfo.alias
          }}</ion-label>
        </div>
        <img
          class="copy-icon-alias"
          (click)="this.copyToClipboard(this.kriptonAccountInfo.alias, 'fiat_ramps.shared.kripton_account_info.alias')"
          src="/assets/img/purchase-order/copy.svg"
        />
      </div>
      <div class="kaic__details__item">
        <div class="kaic__details__item__data">
          <ion-label class="cbu-title ux-font-titulo-xs">{{
            'fiat_ramps.shared.kripton_account_info.cbu' | translate
          }}</ion-label>
          <ion-label class="cbu kaic__details__item__data__value ux-font-text-base">{{
            this.kriptonAccountInfo.cbu
          }}</ion-label>
        </div>
        <img
          class="copy-icon-cbu"
          (click)="this.copyToClipboard(this.kriptonAccountInfo.cbu, 'fiat_ramps.shared.kripton_account_info.cbu')"
          src="/assets/img/purchase-order/copy.svg"
        />
      </div>
      <div class="kaic__details__item">
        <div class="kaic__details__item__data">
          <ion-label class="owner-title ux-font-titulo-xs">{{
            'fiat_ramps.shared.kripton_account_info.owner' | translate
          }}</ion-label>
          <ion-label class="owner kaic__details__item__data__value ux-font-text-base">{{
            this.kriptonAccountInfo.owner
          }}</ion-label>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./kripton-account-info-card.component.scss'],
})
export class KriptonAccountInfoCardComponent implements OnInit {
  @Input() country: string;
  @Input() amount: number;
  @Input() currency: string;
  @Output() copyValue: EventEmitter<any> = new EventEmitter<any>();
  kriptonAccountInfo = KRIPTON_ACCOUNT_INFO;
  constructor() {}

  ngOnInit() {
    this.amount = Number(this.amount)
  }

  copyToClipboard(value, modalText: string) {
    const clipboardInfo = { value, modalText };
    this.copyValue.emit(clipboardInfo);
  }
}