import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { Amount } from '../../types/amount.type';

@Component({
  selector: 'app-transaction-fee',
  template: `
    <div class="tf__fee" *ngIf="this.fee">
      <div class="tf__fee__label">
        <ion-text class="ux-font-titulo-xs">
          {{ 'defi_investments.shared.transaction_fees.label' | translate }}
        </ion-text>
        <ion-button
          class="tf__fee__label__button"
          *ngIf="this.transactionFee"
          class="ion-no-padding"
          slot="icon-only"
          fill="clear"
          appTrackClick
          name="transaction_fee"
          size="small"
          (click)="this.showPhrasetransactionFeeInfo()"
        >
          <ion-icon name="ux-info-circle-outline" color="info"></ion-icon>
        </ion-button>
      </div>

      <div class="tf__fee__label" *ngIf="this.description">
        <ion-text class="ux-font-text-xxs">{{ this.description }}</ion-text>
      </div>

      <div class="tf__fee__qty_and_advice" *ngIf="this.quoteFee.value !== undefined">
        <div class="tf__fee__qty_and_advice__qty">
          <ion-text
            class="ux-font-text-base tf__fee__qty__amount"
            [ngClass]="{ negative: this.balance < this.fee.value }"
            >{{ this.fee.value | formattedAmount }} {{ this.fee.token }}</ion-text
          >
          <ion-text
            class="ux-font-text-base tf__fee__qty__quoteFee"
            [ngClass]="{ negative: this.balance < this.fee.value }"
            >{{ this.quoteFee.value | formattedAmount: 10:2 }} {{ this.quoteFee.token }}
          </ion-text>
        </div>
        <div class="tf__fee__qty_and_advice__funds-advice" *ngIf="this.balance < this.fee.value">
          <img src="assets/img/defi-investments/shared/transaction-fee/exclamation.svg" />
          <ion-text class="ux-font-text-xxs">
            {{ 'defi_investments.shared.transaction_fees.advice' | translate }}
          </ion-text>
        </div>
      </div>
      <div *ngIf="this.quoteFee.value === undefined" class="skeleton">
        <ion-skeleton-text style="width:95%" animated> </ion-skeleton-text>
      </div>
    </div>
  `,
  styleUrls: ['./transaction-fee.component.scss'],
})
export class TransactionFeeComponent implements OnChanges {
  @Input() fee: Amount = { value: undefined, token: 'MATIC' };
  @Input() quoteFee: Amount = { value: undefined, token: 'USD' };
  @Input() balance: number;
  @Input() description: string;
  @Input() transactionFee: boolean;
  @Input() autoPrice: boolean = false;
  @Output() transactionFeeInfoClicked: EventEmitter<void> = new EventEmitter<void>();
  private destroy$ = new Subject<void>();
  private dynamicPriceSubscription: Subscription;

  isAmountSend: boolean;
  isInfoModalOpen = false;

  constructor(
    private dynamicPrice: DynamicPriceFactory,
    private apiWalletService: ApiWalletService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if(this.autoPrice && changes.fee && this.fee?.token) {
      this.dynamicPriceSubscription && this.dynamicPriceSubscription.unsubscribe();
      this.dynamicPriceSubscription = this.getDynamicPrice()
        .subscribe((price: number) => this.setQuoteFee(price));
    }
  }

  private setQuoteFee(tokenPrice: number) {
    this.quoteFee = { value: tokenPrice * this.fee.value, token: 'USD' };
    console.log('price', tokenPrice);
    console.log(this.quoteFee);
  }

  private setNullQuoteFee() {
    this.quoteFee = { value: undefined, token: 'USD' };
  }

  private getDynamicPrice(): Observable<number> {
    return this.dynamicPrice
      .new(15000, { value: this.fee.token }, this.apiWalletService)
      .value()
      .pipe(takeUntil(this.destroy$));
  }

  showPhrasetransactionFeeInfo() {
    this.transactionFeeInfoClicked.emit();
  }
}
