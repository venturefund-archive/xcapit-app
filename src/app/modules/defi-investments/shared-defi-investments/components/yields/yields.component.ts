import { Component, Input, OnInit } from '@angular/core';
import { RawAmount } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of';

@Component({
  selector: 'app-cumulative-yields',
  template: `
    <ion-card class="ux-card ion-padding ion-no-margin cyc">
      <div class="cyc__image">
        <img src="assets/img/defi-investments/yields.svg" />
      </div>
      <div class="cyc__cumulative-yields">
        <div class="cyc__cumulative-yields__token">
          <ion-skeleton-text class="ux-font-text-xl" animated *ngIf="!this.yield"></ion-skeleton-text>
          <ion-text class="ux-font-text-xl" *ngIf="this.yield"> {{ yield.value | formattedAmount }} <span class="ux-font-header-titulo">{{ yield.token }}</span> </ion-text>
        </div>
        <div class="cyc__cumulative-yields__usd">
          <ion-skeleton-text class="ux-font-titulo-xs" style="width:50%" animated *ngIf="!this.yield"></ion-skeleton-text>
          <ion-text class="ux-font-titulo-xs" *ngIf="this.yield">= {{ usdYield.value | formattedAmount: 14:5 }} <span>{{ usdYield.token }}</span> </ion-text>
        </div>
      </div>
    </ion-card>
  `,
  styleUrls: ['./yields.component.scss'],
})
export class YieldsComponent implements OnInit {
  @Input() mode: string;
  @Input() yield: RawAmount;
  @Input() usdYield: RawAmount;

  constructor() {}

  ngOnInit() {}
}
