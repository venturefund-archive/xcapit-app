import { Component, Input, OnInit } from '@angular/core';
import { RawAmount } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';

@Component({
  selector: 'app-cumulative-yields',
  template: `
    <ion-card class="ux-card ion-padding ion-no-margin cyc">
      <div class="cyc__image">
        <img src="assets/img/defi-investments/yields.svg" />
      </div>
      <div class="cyc__yields">
        <div class="cyc__yields__token">
          <ion-text class="ux-font-text-xl"> {{ yield.value | formattedAmount }} <span class="ux-font-header-titulo">{{ yield.token }}</span> </ion-text>
        </div>
        <div class="cyc__yields__usd">
          <ion-text class="ux-font-titulo-xs">= {{ usdYield.value | formattedAmount: 14:5 }} <span>{{ usdYield.token }}</span> </ion-text>
        </div>
      </div>
    </ion-card>
  `,
  styleUrls: ['./cumulative-yields.component.scss'],
})
export class CumulativeYieldsComponent implements OnInit {
  @Input() yield: RawAmount;
  @Input() usdYield: RawAmount;

  constructor() {}

  ngOnInit() {}
}
