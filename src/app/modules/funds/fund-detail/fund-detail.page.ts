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
        <app-ux-loading-block
          *ngIf="!this.fundBalance"
          minSize="40px"
        ></app-ux-loading-block>
        <app-fund-summary-card
          *ngIf="this.fundBalance"
          [summary]="this.fundBalance"
        ></app-fund-summary-card>
      </div>
      <!-- <div class="fd__performance-chart-card">
        <app-performance-chart-card></app-performance-chart-card>
      </div> -->

      <div class="fd__fund-metrics-card">
        <div class="fd__fund-metrics-card__title">
          <ion-text
            class="ux-font-lato ux-fweight-semibold ux-fsize-12"
            color="uxsemidark"
          >
            {{ 'funds.fund_detail.fund_metrics_card.title' | translate }}
          </ion-text>
        </div>
        <app-ux-loading-block
          *ngIf="!this.fundMetrics"
          minSize="40px"
        ></app-ux-loading-block>
        <app-fund-metrics-card
          *ngIf="this.fundMetrics"
          [metrics]="this.fundMetrics"
          [currency]="this.currency"
        ></app-fund-metrics-card>
      </div>

      <div class="fd__fund-portfolio-card">
        <div class="fd__fund-portfolio-card__title">
          <ion-text
            class="ux-font-lato ux-fweight-semibold ux-fsize-12"
            color="uxsemidark"
          >
            {{ 'funds.fund_detail.fund_portfolio_card.title' | translate }}
          </ion-text>
        </div>
        <app-ux-loading-block
          *ngIf="!this.fundBalance"
          minSize="40px"
        ></app-ux-loading-block>
        <app-fund-portfolio-card
          *ngIf="this.fundBalance"
          [fundBalance]="this.fundBalance"
        ></app-fund-portfolio-card>
      </div>

      <div class="fd__fund-operations-history-card">
        <div class="fd__fund-operations-history-card__title">
          <ion-text
            class="ux-font-lato ux-fweight-semibold ux-fsize-12"
            color="uxsemidark"
          >
            {{ 'funds.fund_detail.operations_history_card.title' | translate }}
          </ion-text>
        </div>
        <app-ux-loading-block
          *ngIf="!this.fundOperationsHistory"
          minSize="40px"
        ></app-ux-loading-block>
        <app-fund-operations-history
          *ngIf="this.fundOperationsHistory"
          [operations]="this.fundOperationsHistory"
        ></app-fund-operations-history>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-detail.page.scss']
})
export class FundDetailPage implements OnInit {
  fundName: string;
  fundBalance: any;
  profitGraphCardInfo$: Observable<any>;
  fundMetrics: FundMetricsInterface;
  fundPortfolio: Array<any>;
  fundOperationsHistory: Array<any>;
  currency: string;
  constructor(
    private route: ActivatedRoute,
    private apiFunds: ApiFundsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.getProfitGraphCardInfo();
    this.getFundMetricsCardInfo();
    this.getFundPortfolioCardInfo();
    this.getFundOperationsHistoryInfo();
  }

  getProfitGraphCardInfo() {
    // TODO: Implementar getProfitGraphCardInfo
    console.error('getProfitGraphCardInfo no implementado');
  }

  getFundMetricsCardInfo() {
    this.apiFunds.getMetrics(this.fundName, false).subscribe(data => {
      this.fundMetrics = data.metrics;
      this.currency = data.fund.currency;
    });
  }

  getFundPortfolioCardInfo() {
    this.apiFunds
      .getBalance(this.fundName, undefined, false)
      .subscribe(data => {
        this.fundBalance = data;
      });
  }

  getFundOperationsHistoryInfo() {
    this.apiFunds.getFundRuns('all', this.fundName, false).subscribe(data => {
      this.fundOperationsHistory = data;
    });
  }

  editFund() {
    // TODO: Implementar edit fund
    console.error('Edit fund no implementado');
  }
}
