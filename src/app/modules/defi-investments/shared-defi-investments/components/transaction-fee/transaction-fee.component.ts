import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
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
        <ion-icon
          appTrackClick
          [dataToTrack]="{ eventLabel: 'transaction_fee' }"
          *ngIf="this.transactionFee || this.defaultFeeInfo"
          name="information-circle"
          (click)="this.showPhrasetransactionFeeInfo()"
          color="info"
        ></ion-icon>
      </div>

      <div class="tf__fee__label" *ngIf="this.description">
        <ion-text class="ux-font-text-xxs">{{ this.description }}</ion-text>
      </div>

      <div class="tf__fee__qty_and_advice" *ngIf="this.quoteFee.value !== undefined && this.fee.value !== undefined">
        <div class="tf__fee__qty_and_advice__qty">
          <div *ngIf="this.showErrors">
            <ion-text
              class="ux-font-text-base tf__fee__qty__amount"
              [ngClass]="{ negative: this.balance < this.fee.value && this.showErrors }"
              >{{ this.fee.value | formattedAmount }} {{ this.fee.token }}</ion-text
            >
          </div>
          <div class="tf__fee__qty__faucet" *ngIf="!this.showErrors">
            <ion-badge class="ux-badge-faucet ux-font-num-subtitulo">
              {{ 'defi_investments.shared.transaction_fees.faucet' | translate }}</ion-badge
            >
          </div>
          <ion-text
            class="ux-font-text-base tf__fee__qty__quoteFee"
            [ngClass]="{ negative: this.balance < this.fee.value && this.showErrors }"
            >{{ this.showErrors ? (this.quoteFee.value | formattedAmount: 10:2) : 0 }}
            {{ this.quoteFee.token }}
          </ion-text>
        </div>
        <div class="tf__fee__qty_and_advice__funds-advice" *ngIf="this.balance < this.fee.value && this.showErrors">
          <img src="assets/img/defi-investments/shared/transaction-fee/exclamation.svg" />
          <ion-text class="ux-font-text-xxs">
            {{ 'defi_investments.shared.transaction_fees.advice' | translate }}
          </ion-text>
        </div>
      </div>

      <div *ngIf="this.quoteFee.value === undefined || this.fee.value === undefined" class="skeleton">
        <ion-skeleton-text style="width:100%" animated> </ion-skeleton-text>
      </div>
      <div *ngIf="this.loadingEnabled && (this.quoteFee.value === undefined || this.fee.value === undefined)">
        <ion-text class="ux-font-text-xxs loading-text">
          {{ 'shared.transaction_fees.loading_text' | translate }}
        </ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./transaction-fee.component.scss'],
})
export class TransactionFeeComponent implements OnChanges, OnDestroy {
  private readonly defaultQuoteTokenName = 'USD';
  private readonly nullQuoteFee = { value: undefined, token: this.defaultQuoteTokenName };
  private priceRefreshInterval = 15000;

  @Input() fee: Amount = { value: undefined, token: 'MATIC' };
  @Input() quoteFee: Amount = this.nullQuoteFee;
  @Input() balance: number;
  @Input() description: string;
  @Input() transactionFee: boolean;
  @Input() autoPrice: boolean;
  @Input() defaultFeeInfo: boolean;
  @Input() loadingEnabled = true;
  @Input() showErrors = true;
  @Output() transactionFeeInfoClicked: EventEmitter<void> = new EventEmitter<void>();

  isAmountSend: boolean;
  isInfoModalOpen = false;
  destroy$ = new Subject<void>();
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
        cssClass: 'modal',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
