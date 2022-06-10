import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Amount } from '../../types/amount.type';

@Component({
  selector: 'app-transaction-fee',
  template: `
    <div class="tf__fee" *ngIf="this.fee">
      <div class="tf__fee__label">
        <ion-text class="ux-font-titulo-xs">{{
          'defi_investments.shared.transaction_fees.label' | translate
        }}</ion-text>
      </div>
      <div class="tf__fee__label" *ngIf="this.description">
        <ion-text class="ux-font-text-xxs">{{ this.description }}</ion-text>
      </div>

      <div class="tf__fee__qty_and_advice" *ngIf="this.quoteFee.value">
        <div class="tf__fee__qty_and_advice__qty">
          <ion-text class="ux-font-text-base tf__fee__qty__amount" [ngClass]="{ negative: this.balance < this.fee.value}"
            >{{ this.fee.value | formattedAmount }} {{ this.fee.token }}</ion-text
          >
          <ion-text class="ux-font-text-base tf__fee__qty__quoteFee" [ngClass]="{ negative: this.balance < this.fee.value}"
            >{{ this.quoteFee.value | formattedAmount: 10 : 2 }} {{ this.quoteFee.token }}
          </ion-text>
        </div>
        <div class="tf__fee__qty_and_advice__funds-advice" *ngIf="this.balance < this.fee.value">
          <img src="assets/img/defi-investments/shared/transaction-fee/exclamation.svg" />
          <ion-text class="ux-font-text-xxs">
            {{ 'defi_investments.shared.transaction_fees.advice' | translate }}
          </ion-text>
        </div>
      </div>
      <div *ngIf="!this.quoteFee.value" class="skeleton">
        <ion-skeleton-text style="width:95%" animated> </ion-skeleton-text>
      </div>
    </div>
  `,
  styleUrls: ['./transaction-fee.component.scss'],
})
export class TransactionFeeComponent implements OnInit {
  @Input() fee: Amount = { value: undefined, token: 'MATIC' };
  @Input() quoteFee: Amount = { value: undefined, token: 'USD' };
  @Input() balance: number;
  @Input() description: string;

  constructor() {}

  ngOnInit() {}
}
