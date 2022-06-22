import { Component, Input, OnInit } from '@angular/core';
import { Quotes } from '../../interfaces/quotes.interface';

@Component({
  selector: 'app-item-quote',
  template: `
    <ion-item class="table-header">
      <div class="symbol-group">
        <ion-text *ngIf="!this.isReversed" class="symbol ux-font-text-xs">
          {{ quotation.symbol.slice(0, -4) }}</ion-text
        >
        <ion-text *ngIf="this.isReversed" class="symbol ux-font-text-xs">
          {{ quotation.symbol.split('USDT')[1] }}</ion-text
        >
        <ion-text class="pair ux-font-text-xxs">/USDT</ion-text>
      </div>
      <ion-text class="lastPrice center ux-font-titulo-xs">
        {{ quotation.lastPrice | currency }}
      </ion-text>
      <ion-text class="ux-font-text-xs positive" *ngIf="this.quotation.priceChangePercent >= 0">
        +{{ this.quotation.priceChangePercent | number: '1.0-2' }}%
      </ion-text>
      <ion-text class="ux-font-text-xs regular extrasmall negative" *ngIf="this.quotation.priceChangePercent < 0">
        {{ this.quotation.priceChangePercent | number: '1.0-2' }}%
      </ion-text>
    </ion-item>
    <div class="list-divider" *ngIf="!last"></div>
  `,
  styleUrls: ['./item-quote.component.scss'],
})
export class ItemQuoteComponent implements OnInit {
  @Input() quotation: Quotes;
  @Input() last: any;
  isReversed: boolean;

  constructor() {}

  ngOnInit() {
    this.checkReversedQuotation();
  }

  private checkReversedQuotation() {
    this.isReversed = !this.quotation.symbol.endsWith('USDT');
    if (this.isReversed) this.invertPriceAndChangePercent();
  }

  private invertPriceAndChangePercent(): void {
    const invertedOpenPrice = 1 / this.quotation.openPrice;
    const invertedLastPrice = 1 / this.quotation.lastPrice;
    this.quotation.lastPrice = invertedLastPrice;
    this.quotation.priceChangePercent = ((invertedOpenPrice - invertedLastPrice) / invertedOpenPrice) * 100 * -1;
  }
}
