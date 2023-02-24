import { Component, Input, OnInit } from '@angular/core';
import { Quotes } from '../../interfaces/quotes.interface';

@Component({
  selector: 'app-item-quote',
  template: `
    <ion-item class="iq">
      <div class="iq__wrapper">
        <img class="iq__wrapper__img" [src]="'/assets/img/coins-without-network/' + this.tokenName + '.svg'" />
        <div class="iq__wrapper__pair">
          <div class="iq__wrapper__pair__symbol">
            <ion-text class="iq__wrapper__pair__symbol__base ux-font-text-xs"> {{ this.tokenName }}</ion-text>
            <ion-text class="iq__wrapper__pair__symbol__quote ux-font-text-xxs">/USDT</ion-text>
          </div>
          <ion-text class="iq__wrapper__pair__name ux-font-text-xs"
            >{{ this.quotation.tokenName | titlecase }}
          </ion-text>
        </div>
        <div class="iq__wrapper__price">
          <ion-text class="ux-font-titulo-xs">
            {{ quotation.lastPrice | currency }}
          </ion-text>

          <ion-text
            class="ux-font-text-xs"
            [ngClass]="this.quotation.priceChangePercent >= 0 ? 'iq__wrapper__price__positive' : 'iq__wrapper__price__negative'"
          >
            {{ this.quotation.priceChangePercent >= 0 ? '+' : ''
            }}{{ this.quotation.priceChangePercent | number: '1.0-2' }}%
          </ion-text>
        </div>
      </div>
    </ion-item>
  `,
  styleUrls: ['./item-quote.component.scss'],
})
export class ItemQuoteComponent implements OnInit {
  @Input() quotation: Quotes;
  @Input() last: any;
  isReversed: boolean;
  tokenName: string;
  constructor() {}

  ngOnInit() {
    this.checkReversedQuotation();
    this.setTokenName();
  }

  private setTokenName() {
    this.tokenName = this.isReversed ? this.quotation.symbol.split('USDT')[1] : this.quotation.symbol.split('USDT')[0];
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
