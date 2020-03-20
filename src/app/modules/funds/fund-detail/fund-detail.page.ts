import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { Observable } from 'rxjs';
import { FundMetricsInterface } from '../shared-funds/components/fund-metrics-card/fund-metrics.interface';
import { FundSummaryInterface } from '../shared-funds/components/fund-summary-card/fund-summary.interface';

@Component({
  selector: 'app-fund-detail',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'funds.fund_detail.header' | translate
        }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            class="ux-font-lato ux-fweight-semibold ux-fsize-14 ion-padding-end"
            appTrackClick
            name="Edit Fund"
            (click)="this.editFund()"
          >
            {{ 'funds.fund_detail.edit_button' | translate }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="fd__fund-summary-card">
        <app-fund-summary-card
          [summary]="this.fundSummary"
        ></app-fund-summary-card>
      </div>
      <div class="fd__performance-chart-card">
        <app-performance-chart-card></app-performance-chart-card>
      </div>

      <div class="fd__fund-metrics-card">
        <app-fund-metrics-card
          [metrics]="this.fundMetricsCardInfo$ | async"
        ></app-fund-metrics-card>
      </div>

      <div class="fd__fund-portfolio-card" *ngIf="this.fundPortfolio">
        <app-fund-portfolio-card
          [portfolio]="this.fundPortfolio"
        ></app-fund-portfolio-card>
      </div>

      <div class="fd__fund-operations-history">
        <app-fund-operations-history
          [operations]="this.fundOperationsHistory"
        ></app-fund-operations-history>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-detail.page.scss']
})
export class FundDetailPage implements OnInit {
  fundName: string;
  fundSummary: FundSummaryInterface;
  profitGraphCardInfo$: Observable<any>;
  fundMetricsCardInfo$: Observable<FundMetricsInterface>;
  fundPortfolio: Array<any>;
  fundOperationsHistory: Array<any>;

  constructor(
    private route: ActivatedRoute,
    private apiFunds: ApiFundsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.getFundBalance();
    this.getProfitGraphCardInfo();
    this.getFundMetricsCardInfo();
    this.getFundPortfolioCardInfo();
    this.getFundOperationsHistoryInfo();
  }

  getFundBalance() {
    this.apiFunds.getBalance(this.fundName).subscribe(data => {
      this.fundSummary = data;
      this.fundPortfolio = data.balance.summary;
    });
  }

  getProfitGraphCardInfo() {
    // TODO: Implementar getProfitGraphCardInfo
    console.error('getProfitGraphCardInfo no implementado');
  }

  getFundMetricsCardInfo() {
    // TODO: Implementar getProfitGraphCardInfo
    console.error('getProfitGraphCardInfo no implementado');
  }

  getFundPortfolioCardInfo() {
    // TODO: Implementar getFundPortfolioCardInfo
    console.error('getFundPortfolioCardInfo no implementado');
  }

  getFundOperationsHistoryInfo() {
    this.apiFunds.getFundRuns('active', this.fundName).subscribe(data => {
      this.fundOperationsHistory = data;
      console.log(data);
    });
  }

  editFund() {
    // TODO: Implementar edit fund
    console.error('Edit fund no implementado');
  }
}
