import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SummaryData } from '../../../send/send-summary/interfaces/summary-data.interface';
import { NETWORK_COLORS } from '../../constants/network-colors.constant';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';


@Component({
  selector: 'app-transaction-summary-card',
  template: `
    <div class="tsc ion-padding ux-card">
      <div class="tsc__title">
        <ion-text class="ux-font-text-lg">
          {{ this.title }}
        </ion-text>
      </div>
      <div class="tsc__name-and-icon">
        <div class="tsc__name-and-icon__name">
          <ion-text class="ux-font-text-base">{{ this.summaryData.currency.name }}</ion-text>
          <div class="tsc__name-and-icon__badge">
            <ion-badge [color]="this.networkColors[this.summaryData.network]" class="ux-badge ux-font-num-subtitulo">{{
              this.summaryData.network | formattedNetwork | uppercase
            }}</ion-badge>
          </div>
        </div>
        <div class="tsc__name-and-icon__icon">
          <img [src]="this.summaryData.currency.logoRoute" alt="Crypto icon" />
        </div>
      </div>
      <div class="tsc__amount">
        <div class="tsc__amount__title">
          <ion-text class="ux-font-titulo-xs">{{ this.amountsTitle }}</ion-text>
          <ion-button
            *ngIf="this.amountSend"
            class="ion-no-padding"
            slot="icon-only"
            fill="clear"
            appTrackClick
            name="ux_phrase_information"
            size="small"
            (click)="this.showPhraseAmountInfo()"
          >
            <ion-icon name="ux-info-circle-outline" color="info"></ion-icon>
          </ion-button>
        </div>
        <div class="tsc__amount__content">
          <ion-text class="ux-font-text-base"
            >{{ this.amount | formattedAmount }} {{ this.summaryData.currency.value }}</ion-text
          >
          <ion-text class="ux-font-text-base">{{ this.referenceAmount | formattedAmount: 10:2 }} USD</ion-text>
        </div>
      </div>
      <div class="tsc__address">
        <div class="tsc__address__title">
          <ion-text class="ux-font-titulo-xs">{{ this.addressTitle }}</ion-text>
        </div>

        <div class="tsc__address__content">
          <ion-text class="ux-font-text-base">{{ this.summaryData.address }}</ion-text>
        </div>
      </div>
      <div class="tsc__fee">
        <div class="tsc__fee__title">
          <ion-text class="ux-font-titulo-xs">
            {{ 'wallets.send.send_summary.fee' | translate }}
          </ion-text>
          <ion-button
            *ngIf="this.transactionFee"
            class="ion-no-padding"
            slot="icon-only"
            fill="clear"
            appTrackClick
            name="transaction_fee"
            size="small"
            (click)="this.showPhrasereferenceFeeInfo()"
          >
            <ion-icon name="ux-info-circle-outline" color="info"></ion-icon>
          </ion-button>
        </div>
        <div class="tsc__fee__fee">
          <ion-text class="saic__fee__fee__amount ux-font-text-base"
            >{{ this.fee | formattedAmount }} {{ this.nativeToken.value }}</ion-text
          >
          <ion-text class="saic__fee__fee__reference_amount ux-font-text-base"
            >{{ this.referenceFee | formattedAmount: 10:2 }} USD</ion-text
          >
        </div>
      </div>
      <app-backup-information-card
        [text]="'wallets.send.send_summary.transaction_summary_card.disclaimer' | translate"
        [textClass]="'ux-home-backup-card'"
        [backgroundClass]="'ux-info-background-card'"
      >
      </app-backup-information-card>
    </div>
  `,
  styleUrls: ['./transaction-summary-card.component.scss'],
})
export class TransactionSummaryCardComponent implements OnInit {
  @Input() summaryData: SummaryData;
  @Input() title: string;
  @Input() amountsTitle: string;
  @Input() addressTitle: string;
  @Input() amountSend: boolean;
  @Input() transactionFee: boolean;
  @Output() phraseAmountInfoClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() phrasetransactionFeeInfoClicked: EventEmitter<void> = new EventEmitter<void>();

  networkColors = NETWORK_COLORS;
  nativeToken: Coin;
  referenceAmount: number;
  fee: number;
  referenceFee: number;
  amount: number;
  isAmountSend: boolean;
  isInfoModalOpen = false;
  constructor(private apiWalletService: ApiWalletService) {}

  ngOnInit() {
    this.getNativeToken();
    this.switchToNumber();
  }

  switchToNumber() {
    this.amount = parseFloat(this.summaryData.amount.toString());
    this.referenceAmount = parseFloat(this.summaryData.referenceAmount);
    this.fee = parseFloat(this.summaryData.fee);
    this.referenceFee = parseFloat(this.summaryData.referenceFee);
  }

  private getNativeToken() {
    this.nativeToken = this.apiWalletService.getNativeTokenFromNetwork(this.summaryData.network);
  }

  showPhraseAmountInfo() {
    this.phraseAmountInfoClicked.emit();
  }

  showPhrasereferenceFeeInfo() {
    this.phrasetransactionFeeInfoClicked.emit();
  }
}
