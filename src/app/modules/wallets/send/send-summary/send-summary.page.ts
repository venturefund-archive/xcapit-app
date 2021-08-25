import { Component } from '@angular/core';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { SummaryData } from './interfaces/summary-data.interface';
import { SubmitButtonService } from '../../../../shared/services/submit-button/submit-button.service';

@Component({
  selector: 'app-send-summary',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.send.send_summary.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ss ion-padding">
      <div class="ss__title">
        <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24">
          {{ 'wallets.send.send_summary.title' | translate }}
        </ion-text>
      </div>
      <div class="ss__transaction-summary-card" *ngIf="this.summaryData">
        <app-transaction-summary-card
          [amountsTitle]="'wallets.send.send_summary.amounts_title' | translate"
          [summaryData]="this.summaryData"
        ></app-transaction-summary-card>
      </div>

      <div class="ss__send_button">
        <ion-button
          appTrackClick
          name="Send"
          [disabled]="this.submitButtonService.isDisabled | async"
          (click)="this.send()"
        ></ion-button>
      </div>
    </ion-content>`,
  styleUrls: ['./send-summary.page.scss'],
})
export class SendSummaryPage {
  summaryData: SummaryData;
  constructor(
    private transactionDataService: TransactionDataService,
    public submitButtonService: SubmitButtonService
  ) {}

  ionViewWillEnter() {
    this.summaryData = this.transactionDataService.transactionData;
  }

  send() {
    console.error('Not implemented yet :S');
  }
}
