import { Component, Input, OnInit } from '@angular/core';
import { SummaryData } from '../../../send/send-summary/interfaces/summary-data.interface';

@Component({
  selector: 'app-transaction-summary-card',
  template: `
    <div class="tsc ion-padding">
      <div class="tsc__name-and-icon">
        <div>
          <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12">{{ this.summaryData.currency.name }}</ion-text>
          <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12">{{ this.summaryData.network }}</ion-text>
        </div>
        <div class="tsc__name-and-icon__icon">
          <img [src]="this.summaryData.currency.logoRoute" alt="Crypto icon" />
        </div>
      </div>
      <div class="tsc__amount">
        <div class="tsc__amount__title">
          <ion-text class="ux-font-lato ux-fweight-semibold ux-fsize-12">{{ this.amountsTitle }}</ion-text>
        </div>
        <div class="tsc__amount__content">
          <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12"
            >{{ this.summaryData.amount }} {{ this.summaryData.currency.value }}</ion-text
          >
          <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12"
            >{{ this.summaryData.referenceAmount }} USD</ion-text
          >
        </div>
      </div>
      <div class="tsc__address">
        <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12">{{ this.summaryData.address }}</ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./transaction-summary-card.component.scss'],
})
export class TransactionSummaryCardComponent implements OnInit {
  @Input() summaryData: SummaryData;
  @Input() amountsTitle: string;

  constructor() {}

  ngOnInit() {}
}
