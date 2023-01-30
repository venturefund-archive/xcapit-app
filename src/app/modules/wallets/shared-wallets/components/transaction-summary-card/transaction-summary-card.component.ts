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
      <app-asset-detail
        [blockchain]="this.summaryData.network"
        [token]="this.summaryData.currency.value"
        [tokenLogo]="this.summaryData.currency.logoRoute"
      ></app-asset-detail>
      <div class="tsc__amount">
        <div class="tsc__amount__title">
          <ion-text class="ux-font-titulo-xs">{{ this.amountsTitle }}</ion-text>
          <ion-button
            *ngIf="this.amountSend"
            class="ion-no-padding ion-no-margin"
            slot="icon-only"
            fill="clear"
            appTrackClick
            name="ux_phrase_information"
            size="small"
            (click)="this.showPhraseAmountInfo()"
          >
            <ion-icon name="information-circle"></ion-icon>
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
          <app-contact-item
            *ngIf="this.summaryData.contact"
            [name]="this.summaryData.contact"
            [address]="this.summaryData.address"
            [networks]="[this.summaryData.network]"
            [showWalletImg]="false"
            [boldName]="false"
          ></app-contact-item>
          <ion-text *ngIf="!this.summaryData.contact" class="ux-font-text-base">{{
            this.summaryData.address
          }}</ion-text>
        </div>
      </div>
      <div class="tsc__fee">
        <div class="tsc__fee__title">
          <ion-text class="ux-font-titulo-xs">
            {{ 'wallets.send.send_summary.fee' | translate }}
          </ion-text>
          <ion-button
            *ngIf="this.transactionFee"
            class="ion-no-padding ion-no-margin"
            slot="icon-only"
            fill="clear"
            appTrackClick
            name="transaction_fee"
            size="small"
            (click)="this.showPhrasereferenceFeeInfo()"
          >
            <ion-icon name="information-circle"></ion-icon>
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
