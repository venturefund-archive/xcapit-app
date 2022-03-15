import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Coin } from '../../../../wallets/shared-wallets/interfaces/coin.interface';
import { Amount } from '../../types/amount.type';

@Component({
  selector: 'app-defi-investment-withdraw-card',
  template: `
    <div class="diw">
      <div class="diw__withdraw-title">
        <ion-text class="ux-font-text-lg">{{ 'defi_investments.shared.withdraw_card.title' | translate }}</ion-text>
      </div>
      <div class="diw__content">
        <div class="diw__content__image">
          <div>
            <img class="diw__content__image__img" [src]="this.token.logoRoute" alt="Product Image" />
          </div>
        </div>
        <div class="diw__content__info">
          <div class="diw__content__info__group">
            <ion-text class="ux-font-text-lg symbol">{{ this.amount.token }}</ion-text>
            <ion-text class="ux-font-text-lg balance">{{ this.amount.value | number: '1.2-8' }} </ion-text>
          </div>
          <div class="diw__content__info__group">
            <ion-text class="ux-font-text-xs description">{{ (this.token.name | splitString: ' - ')[1] }}</ion-text>
            <ion-text class="ux-font-text-xs converted-balance"
              >{{ this.quoteAmount.value | number: '1.2-6' }} {{ this.quoteAmount.token }}</ion-text
            >
          </div>
        </div>
      </div>
      <div class="diw__separator"></div>
      <div class="diw__details">
        <ion-text class="ux-font-header-titulo">{{
          'defi_investments.shared.withdraw_card.transaction_details' | translate
        }}</ion-text>
        <div class="diw__details__fee">
          <ion-text class="diw__details__fee__title ux-font-title-xs">{{
            'defi_investments.shared.withdraw_card.transaction_fee' | translate
          }}</ion-text>
          <div class="diw__details__fee__amount">
            <ion-text class="ux-font-text-base">{{ this.fee.value | number: '1.2-8' }} {{ this.fee.token }}</ion-text>
            <ion-text class="ux-font-text-base"
              >{{ this.quoteFee.value | number: '1.2-6' }} {{ this.quoteFee.token }}</ion-text
            >
          </div>
        </div>
      </div>
      <div class="diw__confirm-button">
        <ion-button
          [appLoading]="this.loading"
          [loadingText]="'defi_investments.shared.withdraw_card.confirm_loading' | translate"
          appTrackClick
          name="Confirm Withdrawal"
          expand="block"
          size="large"
          type="submit"
          class="ion-padding-start ion-padding-end ux_button"
          color="secondary"
          (click)="this.withdraw()"
        >
          {{ 'defi_investments.shared.withdraw_card.confirm' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./defi-investment-withdraw.component.scss'],
})
export class DefiInvestmentWithdrawComponent implements OnInit {
  @Input() token: Coin;
  @Input() fee: Amount;
  @Input() quoteFee: Amount;
  @Input() amount: Amount;
  @Input() quoteAmount: Amount;
  @Input() loading = false;
  @Output() withdrawClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  withdraw() {
    this.withdrawClicked.emit();
  }
}
