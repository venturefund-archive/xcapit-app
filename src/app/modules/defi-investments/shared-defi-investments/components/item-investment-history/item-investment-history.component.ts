import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-investment-history',
  template: `  <ion-item class="table-header">
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
<div class="list-divider" *ngIf="!last"></div>`,
  styleUrls: ['./item-investment-history.component.scss'],
})
export class ItemInvestmentHistoryComponent implements OnInit {
  @Input() quotation;
  @Input() last: any;
  isReversed: boolean;

  constructor() { }

  ngOnInit() {}

}
