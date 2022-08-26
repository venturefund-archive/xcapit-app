import { Component, OnInit } from '@angular/core';
import { NETWORK_COLORS } from '../shared-wallets/constants/network-colors.constant';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { CovalentTransfer } from '../shared-wallets/models/covalent-transfer/covalent-transfer';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { TransactionDetailsService } from '../shared-wallets/services/transaction-details/transaction-details.service';
import { format, parseISO } from 'date-fns';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { ScanUrlOf } from '../shared-wallets/models/scan-url-of/scan-url-of';
@Component({
  selector: 'app-transaction-details',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.transaction_details.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="td ion-padding">
      <div class="td__card" *ngIf="this.currency">
        <div class="td__card__title">
          <ion-text class="ux-font-text-xl">{{
            'wallets.transaction_details.' + this.transactionData.type | translate
          }}</ion-text>
        </div>
        <div class="td__card__container">
          <div class="td__card__container__title_and_image">
            <div class="td__card__container__title_and_image__image_container">
              <img [src]="this.currency.logoRoute" alt="Product Image" />
            </div>
            <div class="td__card__container__title_container">
              <div class="td__card__container__title_container__title">
                <ion-text class="ux-font-text-lg">{{ this.currency.value }}</ion-text>
              </div>
              <div class="td__card__container__title_container__badge">
                <ion-badge [color]="this.networkColors[this.currency.network]" class="ux-badge ux-font-num-subtitulo">{{
                  this.currency.network | formattedNetwork | uppercase
                }}</ion-badge>
              </div>
            </div>
          </div>
          <div class="td__card__container__amount">
            <div>
              <ion-text class="ux-font-text-lg"
                >{{ this.transactionData.amount }} {{ this.currency.value | titlecase }}</ion-text
              >
            </div>
            <div class="td__card__container__amount__conversion">
              <ion-text class="ux-font-text-xs">
                = {{ this.quoteTransactionAmount | formattedAmount: 10:2 }} USD
              </ion-text>
            </div>
          </div>
        </div>
        <div class="td__card__item">
          <div class="divider list-divider"></div>
          <div class="td__card__item__title">
            <ion-text class="ux-font-title-xs">{{ 'wallets.transaction_details.title_status' | translate }}</ion-text>
          </div>
          <div class="container-item">
            <div class="td__card__item__badge">
              <ion-badge
                class="ux-font-num-subtitulo"
                [ngClass]="{ confirmed: this.transactionData.successful, declined: !this.transactionData.successful }"
              >
                {{
                  (this.transactionData.successful ? 'wallets.transactions.confirmed' : 'wallets.transactions.declined')
                    | translate
                }}</ion-badge
              >
            </div>
            <div class="td__card__item__link">
              <ion-text (click)="this.openTransactionUrl()" class="ux-link-xs">{{
                'wallets.transaction_details.link' | translate
              }}</ion-text>
            </div>
          </div>
          <div class="divider list-divider"></div>
          <div class="td__card__item__title">
            <ion-text class="ux-font-title-xs">{{ 'wallets.transaction_details.title_wallet' | translate }}</ion-text>
          </div>
          <div class="td__card__item__wallet">
            <ion-text class="ux-font-text-base">{{ this.transactionData.to }}</ion-text>
          </div>
          <div class="divider list-divider"></div>
          <div class="td__card__item__title">
            <ion-text class="ux-font-title-xs">{{ 'wallets.transaction_details.title_fee' | translate }}</ion-text>
          </div>
          <div class="container-item">
            <div class="td__card__item__fee">
              <ion-text class="ux-font-text-base">{{ this.fee }}</ion-text>
            </div>
            <div class="td__card__item__usd">
              <ion-text class="ux-font-text-base"
                >{{ this.transactionData.gasQuote | formattedAmount: 10:2 }} USD</ion-text
              >
            </div>
          </div>
          <div class="divider list-divider"></div>
          <div class="td__card__item__title">
            <ion-text class="ux-font-title-xs">{{ 'wallets.transaction_details.title_date' | translate }}</ion-text>
          </div>
          <div class="container-item">
            <div class="td__card__item__date">
              <ion-text class="ux-font-text-base">{{ this.formattedDate }}</ion-text>
            </div>
            <div class="td__card__item__time">
              <ion-text class="ux-font-text-base">{{ this.formattedTime }} H</ion-text>
            </div>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {
  currency: Coin;
  networkColors = NETWORK_COLORS;
  transactionData: CovalentTransfer;
  quoteTransactionFee: number;
  quoteTransactionAmount: number;
  formattedDate: string;
  formattedTime: string;
  date: Date;
  fee: number;

  constructor(
    private transactionDetailsService: TransactionDetailsService,
    private apiWalletService: ApiWalletService,
    private browserService: BrowserService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getTransactionData();
    this.getCurrency();
    this.getPrice();
    this.date = new Date(this.transactionData.date);
    this.formattedTime = this.formatTime(this.date.toLocaleTimeString());
    this.formattedDate = this.formatDate(this.transactionData.date);
  }

  private getTransactionData() {
    this.transactionData = this.transactionDetailsService.transactionData;
    this.fee = this.transactionData.getFee();
  }

  private getCurrency() {
    this.currency = this.apiWalletService.getCoin(this.transactionData.symbol);
  }

  private getPrice() {
    this.apiWalletService.getPrices([this.currency.value], false).subscribe((res) => this.calculate(res));
  }

  private calculate(res) {
    this.quoteTransactionFee = res.prices[this.currency.value] * this.transactionData.feePaid;
    this.quoteTransactionAmount = res.prices[this.currency.value] * this.transactionData.amount;
  }

  private formatDate(value) {
    return format(parseISO(value), 'dd-MM-yyyy');
  }

  private formatTime(value: string) {
    const time = value.split(':');
    time.pop();
    return time.join(':');
  }

  openTransactionUrl() {
    this.browserService.open({ url: ScanUrlOf.create(this.transactionData.hash, this.currency.network).value() });
  }
}
