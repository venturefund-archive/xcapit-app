import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { Observable } from 'rxjs';
import { FundPercentageEvolutionChartInterface } from '../shared-funds/components/performance-chart-card/fund-performance-chart.interface';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { CONFIG } from 'src/app/config/app-constants.config';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';
import { Currency } from '../shared-funds/enums/currency.enum';



@Component({
  selector: 'app-fund-detail',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <div>
          <ion-title class="fd__header-title ion-text-center">{{
            'funds.fund_detail.header' | translate
          }}</ion-title>
          <ion-title class="fd__header-fund ion-text-center">{{
            this.fundName
          }}</ion-title>
        </div>
        <div class="fd__header-button" *ngIf="this.isOwner">
          <ion-buttons class="fd__header-button" slot="end">
            <ion-button
              class="ux-font-lato ux-fweight-semibold ux-fsize-14 ion-padding-end"
              appTrackClick
              name="Edit Fund"
              (click)="this.editFund()"
            >
              {{ 'funds.fund_detail.edit_button' | translate }}
            </ion-button>
          </ion-buttons>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="fd__type-toggle">
        <a (click)="this.hideText()">
          <ion-icon
            class="fd__eye-button"
            [hidden]="this.hideFundText != true"
            name="eye-off-outline"
          ></ion-icon>
          <ion-icon
            class="fd__eye-button"
            [hidden]="this.hideFundText === true"
            name="eye-outline"
          ></ion-icon>
        </a>
      </div>

      <!-- Fund Summary Card -->
      <div class="fd__fund-summary-card">
        <app-ux-loading-block
          *ngIf="!this.fundBalance"
          minSize="40px"
        ></app-ux-loading-block>
        <app-fund-summary-card
          *ngIf="this.fundBalance"
          [fundBalance]="this.fundBalance"
          [summary]="this.fundBalance"
        ></app-fund-summary-card>
      </div>

      <!-- Fund Performance Chart Card -->
      <div class="fd__fund-performance-chart-card" *ngIf="this.isChart">
        <div class="fd__fund-performance-chart-card__title">
          <ion-text
            class="ux-font-lato ux-fweight-semibold ux-fsize-12"
            color="uxsemidark"
          >
            {{ 'funds.fund_detail.performance_chart_card.title' | translate }}
          </ion-text>
        </div>
        <div class="fd__fund-performance-chart-card__periods">
          <div
            class="fd__fund-performance-chart-card__periods__period"
            *ngFor="let delta of deltas"
          >
            <ion-button
              [ngClass]="{ active: this.selectedDelta == delta.value }"
              class="fd__fund-performance-chart-card__periods__period__button ux-font-lato ux-fweight-semibold ux-fsize-14"
              fill="clear"
              size="small"
              (click)="this.setDelta(delta.value)"
            >
              {{ delta.name }}
            </ion-button>
          </div>
        </div>
        <app-performance-chart-card
          [fundPercentageEvolution]="this.fundPercentageEvolution"
          [interval]="this.selectedDelta"
          [isChart]="this.isChart"
          [shareChart]="true"
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
          *ngIf="!this.fundResume || !this.fundSettings"
          minSize="40px"
        ></app-ux-loading-block>
        <app-fund-metrics-card
          *ngIf="this.fundResume && this.fundSettings"
          [resume]="this.fundResume"
          [settings]="this.fundSettings"
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
          [fundName]="this.fundName"
          [isOwner]="this.isOwner"
        ></app-fund-portfolio-card>
      </div>

      <!-- Fund Timeline Card -->
      <div class="fd__fund-operations-history-card" *ngIf="this.fundTimeline">
        <div class="fd__fund-operations-history-card__title">
          <ion-text
            class="ux-font-lato ux-fweight-semibold ux-fsize-12"
            color="uxsemidark"
          >
            {{ 'funds.fund_detail.operations_history_card.title' | translate }}
          </ion-text>
        </div>
        <app-fund-timeline
          [runs]="this.fundTimeline"
          [fundName]="this.fundName"
          [isOwner]="this.isOwner"
        ></app-fund-timeline>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-detail.page.scss'],
})
export class FundDetailPage implements OnInit {
  fundName: string;
  fundBalance: any;
  fundPercentageEvolution: FundPercentageEvolutionChartInterface;
  profitGraphCardInfo$: Observable<any>;
  fundResume: any;
  fundSettings: any;
  fundPortfolio: Array<any>;
  fundTimeline: Array<any>;
  currency: string;
  isOwner: any;
  isChart: boolean;
  hideFundText: boolean;

  currencies = [Currency.BTC, Currency.USDT];

  deltas = [
    {
      value: '1d',
      name: this.translate.instant(
        'funds.fund_detail.performance_chart_card.delta.one_day'
      ),
    },
    {
      value: '7d',
      name: this.translate.instant(
        'funds.fund_detail.performance_chart_card.delta.one_week'
      ),
    },
    {
      value: '30d',
      name: this.translate.instant(
        'funds.fund_detail.performance_chart_card.delta.thirty_days'
      ),
    },
    {
      value: '90d',
      name: this.translate.instant(
        'funds.fund_detail.performance_chart_card.delta.ninety_days'
      ),
    },
    {
      value: '',
      name: this.translate.instant(
        'funds.fund_detail.performance_chart_card.delta.all'
      ),
    },
  ];
  selectedDelta;

  constructor(
    private route: ActivatedRoute,
    private apiFunds: ApiFundsService,
    private translate: TranslateService,
    private router: Router,
    private storage: Storage,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.getStorageRange();
    this.getFundMetricsCardInfo();
    this.subscribeOnHideFunds();
    this.getFundOperationsHistoryInfo();
  }

  async getStorageRange() {
    this.selectedDelta = await this.storage.get(
      CONFIG.chartRangeValues.selected
    );
    this.selectedDelta =
      this.selectedDelta == null || this.selectedDelta == undefined
        ? '7d'
        : this.selectedDelta;
    this.getFundPerformanceCardInfo();
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe(
      (res) => (this.hideFundText = res)
    );
  }

  getFrequencyByDelta() {
    let frequency: string;
    if (this.selectedDelta === '1d') {
      frequency = '1m';
    } else {
      frequency = '1d';
    }
    return frequency;
  }

  getFundPerformanceCardInfo() {
    const frequency = this.getFrequencyByDelta();
    this.apiFunds
      .getPercentageEvolution(
        this.fundName,
        '',
        this.selectedDelta,
        frequency,
        false
      )
      .subscribe((data) => {
        if (data.percentage_evolution) {
          data.percentage_evolution.take_profit = data.fund.ganancia;
          data.percentage_evolution.stop_loss = data.fund.perdida;
          this.isChart = true;
        }
        this.fundPercentageEvolution = data.percentage_evolution;
        this.currency = data.fund.currency;
        this.isOwner = data.fund.is_owner;
        this.getFundPortfolioCardInfo();
      });
  }

  getFundMetricsCardInfo() {
    this.apiFunds.getFundBalances('all', false).subscribe((data) => {
      let fund;
      for (fund of data) {
        if (fund.fund_name == this.fundName) {
          this.fundResume = fund;
          break;
        }
      }
    });
    this.apiFunds.getLastFundRun(this.fundName, false).subscribe((data) => {
      this.fundSettings = data;
    });
  }

  getFundPortfolioCardInfo() {
    const currency = (this.currency == Currency.BTC) ? Currency.USDT : Currency.BTC; 
    this.apiFunds
        .getBalance(this.fundName, currency, false)
        .subscribe((data) => {
          this.fundBalance = data;
        });
  }

  async getFundOperationsHistoryInfo() {
    this.apiFunds.getLastPercentage(this.fundName).subscribe((data) => {
      this.fundTimeline = data;
    });
  }

  editFund() {
    this.router.navigate(['/funds/fund-settings', this.fundName]);
  }

  setDelta(selected: string) {
    this.storage.set(CONFIG.chartRangeValues.selected, selected);
    this.selectedDelta = selected;
    this.fundPercentageEvolution = undefined;
    this.getFundPerformanceCardInfo();
  }

  hideText() {
    this.localStorageService.toggleHideFunds();
  }
}
