import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-fund-portfolio-card',
  template: `
    <div class="fpc__title">
      <ion-text
        class="ux-font-lato ux-fweight-semibold ux-fsize-12"
        color="uxsemidark"
      >
        {{ 'funds.fund_detail.fund_portfolio_card.title' | translate }}
      </ion-text>
    </div>
    <div class="fpc">
      <div class="fpc__content">
        <div class="fpc__content__left">
          <app-fund-balance-chart
            [fundBalance]="this.portfolio"
            [currency]="this.currency"
          ></app-fund-balance-chart>
        </div>
        <div class="fpc__content__right">
          <ul *ngIf="portfolio">
            <li *ngFor="let p of portfolio">
              {{ p.ca }}: percentage: {{ p.percentage }} - color:
              {{ p.color }} -
            </li>
          </ul>
          <div class="by-currency"></div>
          <div class="base"></div>
        </div>
      </div>
      <div class="fpc__footer"></div>
    </div>
  `,
  styleUrls: ['./fund-portfolio-card.component.scss']
})
export class FundPortfolioCardComponent implements OnInit {
  @Input() portfolio: Array<{
    ca: string;
    amount: number;
    value: number;
    percentage: number;
    color: string;
  }>;
  @Input() currency: string;
  data: any;

  constructor() {}

  ngOnInit() {
    console.log('asdasdasdasd', this.portfolio);
  }
}
