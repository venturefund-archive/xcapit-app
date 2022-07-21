import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InfoSendModalComponent } from 'src/app/modules/wallets/shared-wallets/components/info-send-modal/info-send-modal.component';
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
          class="tf__fee__label__button ion-no-padding"
          *ngIf="this.transactionFee || this.defaultFeeInfo"
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

      <div class="tf__fee__qty_and_advice" *ngIf="this.quoteFee.value !== undefined && this.fee.value !== undefined">
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
      <div *ngIf="this.quoteFee.value === undefined || this.fee.value === undefined" class="skeleton">
        <ion-skeleton-text style="width:100%" animated> </ion-skeleton-text>
      </div>
      <div *ngIf="this.quoteFee.value === undefined || this.fee.value === undefined">
        <ion-text class="ux-font-text-xxs loading-text"> {{ 'shared.transaction_fees.loading_text' | translate }} </ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./transaction-fee.component.scss'],
})
export class TransactionFeeComponent implements OnChanges {
  private readonly defaultQuoteTokenName = 'USD';
  private readonly nullQuoteFee = { value: undefined, token: this.defaultQuoteTokenName };
  private destroy$ = new Subject<void>();
  private priceRefreshInterval = 15000;

  @Input() fee: Amount = { value: undefined, token: 'MATIC' };
  @Input() quoteFee: Amount = this.nullQuoteFee;
  @Input() balance: number;
  @Input() description: string;
  @Input() transactionFee: boolean;
  @Input() autoPrice: boolean;
  @Input() defaultFeeInfo: boolean;
  @Output() transactionFeeInfoClicked: EventEmitter<void> = new EventEmitter<void>();

  isAmountSend: boolean;
  isInfoModalOpen = false;
  dynamicPriceSubscription: Subscription;

  constructor(
    private dynamicPrice: DynamicPriceFactory,
    private apiWalletService: ApiWalletService,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  async showDefaultFeeInfo() {
    if (!this.isInfoModalOpen && this.defaultFeeInfo) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: InfoSendModalComponent,
        componentProps: {
          title: this.translate.instant('shared.transaction_fees.title'),
          description: this.translate.instant('shared.transaction_fees.description'),
          buttonText: this.translate.instant('shared.transaction_fees.button_text'),
        },
        cssClass: 'ux-xxs-modal-informative',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setAutoPrice(changes.fee);
  }

  private setAutoPrice(feeChanges: any) {
    if (this.isOkForAutoPrice(feeChanges)) {
      this.setNullQuoteFee();
      this.priceUnsubscribe();
      this.setFeeTokenPrice();
    }
  }

  private setFeeTokenPrice() {
    this.dynamicPriceSubscription = this.feeTokenPrice().subscribe((price: number) => this.setQuoteFee(price));
  }

  private priceUnsubscribe() {
    this.dynamicPriceSubscription && this.dynamicPriceSubscription.unsubscribe();
  }

  private isOkForAutoPrice(feeChanges: any): boolean {
    return !!(this.autoPrice && feeChanges && this.fee.token);
  }

  private setQuoteFee(tokenPrice: number) {
    this.quoteFee = { value: tokenPrice * this.fee.value, token: this.defaultQuoteTokenName };
  }

  private setNullQuoteFee() {
    this.quoteFee = this.nullQuoteFee;
  }

  private feeTokenPrice(): Observable<number> {
    return this.dynamicPrice
      .new(this.priceRefreshInterval, { value: this.fee.token }, this.apiWalletService)
      .value()
      .pipe(takeUntil(this.destroy$));
  }

  showPhrasetransactionFeeInfo() {
    if (!this.defaultFeeInfo) {
      this.transactionFeeInfoClicked.emit();
    } else {
      this.showDefaultFeeInfo();
    }
  }
}