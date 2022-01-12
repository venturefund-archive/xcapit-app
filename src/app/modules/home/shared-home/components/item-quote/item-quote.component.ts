import { Component, Input, OnInit } from '@angular/core';
import { Quotes } from '../../interfaces/quotes.interface';

@Component({
  selector: 'app-item-quote',
  template: `
    <ion-item class="table-header">
      <div class="symbol-group">
        <ion-text class="symbol ux-font-text-xs"> {{ quote.symbol?.slice(0, -4) }}</ion-text>
        <ion-text class="pair ux-font-text-xxs">/USDT</ion-text>
      </div>
      <ion-text class="lastPrice center ux-font-titulo-xs">
        {{ quote.lastPrice | currency }}
      </ion-text>
      <ion-text class="ux-font-text-xs positive" *ngIf="this.quote.priceChangePercent >= 0">
        +{{ this.quote.priceChangePercent | number: '1.0-2' }}%
      </ion-text>
      <ion-text class="ux-font-text-xs regular extrasmall negative" *ngIf="this.quote.priceChangePercent < 0">
        {{ this.quote.priceChangePercent | number: '1.0-2' }}%
      </ion-text>
    </ion-item>
    <div class="list-divider" *ngIf="!last"></div>
  `,
  styleUrls: ['./item-quote.component.scss'],
})
export class ItemQuoteComponent implements OnInit {
  @Input() quote: Quotes;
  @Input() last: any;
  constructor() {}

  ngOnInit() {}
}
