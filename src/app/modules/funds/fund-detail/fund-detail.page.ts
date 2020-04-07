import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { Observable } from 'rxjs';
import { FundMetricsInterface } from '../shared-funds/components/fund-metrics-card/fund-metrics.interface';
import { FundPerformanceChartComponent } from '../shared-funds/components/fund-performance-chart/fund-performance-chart.component';
import { FundPerformanceChartInterface } from '../shared-funds/components/performance-chart-card/fund-performance-chart.interface';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { UxSelectModalComponent } from 'src/app/shared/components/ux-select-modal/ux-select-modal.component';

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
      <!-- Fund Summary Card -->
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

      <!-- Fund Performance Chart Card -->
      <div class="fd__fund-performance-chart-card">
        <div class="fd__fund-performance-chart-card__title">
          <ion-text
            class="ux-font-lato ux-fweight-semibold ux-fsize-12"
            color="uxsemidark"
          >
            {{ 'funds.fund_detail.performance_chart_card.title' | translate }}
          </ion-text>
          <ion-button
            color="uxsecondary"
            class="delta-button ux-font-lato ux-fweight-semibold ux-fsize-14"
            appTrackClick
            name="Change Delta"
            fill="clear"
            size="small"
            (click)="this.changeDelta()"
            [disabled]="!this.fundPerformance"
          >
            {{ this.selectedDelta.name }}
            <ion-icon slot="end" name="ux-down"></ion-icon>
          </ion-button>
        </div>
        <app-ux-loading-block
          *ngIf="!this.fundPerformance"
          minSize="40px"
        ></app-ux-loading-block>
        <app-performance-chart-card
          *ngIf="this.fundPerformance"
          [fundPerformance]="this.fundPerformance"
          [interval]="this.selectedDelta.value"
        ></app-performance-chart-card>
      </div>

      <!-- Fund Metrics Card -->
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

      <!-- Fund Portfolio Card -->
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

      <!-- Fund Operations History Card -->
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
  fundPerformance: FundPerformanceChartInterface;
  profitGraphCardInfo$: Observable<any>;
  fundMetrics: FundMetricsInterface;
  fundPortfolio: Array<any>;
  fundOperationsHistory: Array<any>;
  currency: string;
  deltas = [
    {
      value: '1d',
      name: this.translate.instant(
        'funds.fund_detail.performance_chart_card.delta.one_day'
      )
    },
    {
      value: '1w',
      name: this.translate.instant(
        'funds.fund_detail.performance_chart_card.delta.one_week'
      )
    },
    {
      value: '30d',
      name: this.translate.instant(
        'funds.fund_detail.performance_chart_card.delta.thirty_days'
      )
    },
    {
      value: '',
      name: this.translate.instant(
        'funds.fund_detail.performance_chart_card.delta.all'
      )
    }
  ];
  selectedDelta = this.deltas[1];

  constructor(
    private route: ActivatedRoute,
    private apiFunds: ApiFundsService,
    private translate: TranslateService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.getFundPerformanceCardInfo();
    this.getFundMetricsCardInfo();
    this.getFundPortfolioCardInfo();
    this.getFundOperationsHistoryInfo();
  }

  getFundPerformanceCardInfo(delta: any = this.selectedDelta) {
    this.apiFunds
      .getPerformance(this.fundName, '', delta.value, false)
      .subscribe(data => {
        this.fundPerformance = data.performance;
        this.selectedDelta = delta;
      });
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

  async changeDelta() {
    const modal = await this.modalController.create({
      component: UxSelectModalComponent,
      componentProps: {
        title: this.translate.instant(
          'funds.fund_detail.performance_chart_card.delta.title'
        ),
        data: this.deltas,
        keyName: 'name',
        valueName: 'value',
        selected: this.selectedDelta.value
      },
      swipeToClose: false,
      cssClass: 'ux-routeroutlet-modal'
    });

    modal.present();

    const data = await modal.onDidDismiss();

    if (data.role === 'selected') {
      this.setDelta(data.data);
    }
  }

  setDelta(selected: string) {
    const deltaItem = this.deltas.find(item => item.value === selected);
    this.fundPerformance = undefined;
    this.getFundPerformanceCardInfo(deltaItem);
  }
}
