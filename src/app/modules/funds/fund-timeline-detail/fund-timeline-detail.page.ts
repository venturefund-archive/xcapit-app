import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { FundPercentageEvolutionChartInterface } from '../shared-funds/components/performance-chart-card/fund-performance-chart.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-timeline-detail',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/detail/{{ this.fundName }}"></ion-back-button>
        </ion-buttons>
        <div>
          <ion-title class="atd__header-date ion-text-center">
            {{ this.fund?.fecha_inicio | date: 'dd/MM/yy' }}</ion-title
          >
          <ion-title class="atd__header-fund">{{ this.fundName }}</ion-title>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div>
        <div class="atd__chart-card" *ngIf="this.isChart">
          <app-performance-chart-card
            [fundPercentageEvolution]="this.fundPercentageEvolution"
            interval="7d"
            page="app-timeline-detail"
          ></app-performance-chart-card>
        </div>
        <div class="atd__performance-card">
          <ion-list class="atd__performance-card__content">
            <ion-item class="atd__performance-card__content__item">
              <ion-label>
                <ion-text class="ux-font-text-xxs regular" color="neutral80">
                  {{ 'funds.fund_timeline_detail.performance_card.performance_label' | translate }}
                </ion-text>
              </ion-label>
              <ion-label>
                <ion-text class="ux-font-text-xs positive" *ngIf="this.fund?.percentage >= 0">
                  {{ this.fund?.percentage | number: '1.0-2' }}%
                </ion-text>
                <ion-text class="ux-font-text-xs negative" *ngIf="this.fund?.percentage < 0">
                  {{ this.fund?.percentage | number: '1.0-2' }}%
                </ion-text>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
        <div class="atd__config">
          <div class="atd__config__title">
            <ion-text class="ux-font-subheading" color="neutral80">
              {{ 'funds.fund_timeline_detail.config_card.title' | translate }}
            </ion-text>
          </div>
          <ion-list class="atd__config__content">
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{ 'funds.fund_timeline_detail.config_card.item.state' | translate }}</ion-text>
                <ion-text
                  class="atd__config__content__item__value_finalizado"
                  *ngIf="this.fund?.estado === 'finalizado'"
                  >{{ 'funds.fund_timeline_detail.config_card.item.status_finished' | translate }}</ion-text
                >
                <ion-text class="atd__config__content__item__value_active" *ngIf="this.fund?.estado === 'active'">
                  {{ 'funds.fund_timeline_detail.config_card.item.status_active' | translate }}</ion-text
                >
              </ion-label>
            </ion-item>
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{ 'funds.fund_timeline_detail.config_card.item.initial_date' | translate }}</ion-text>
                <ion-text class="atd__config__content__item__value">
                  {{ this.fund?.fecha_inicio | localizedDate: 'longDate' }}
                </ion-text>
              </ion-label>
            </ion-item>
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{ 'funds.fund_timeline_detail.config_card.item.profile' | translate }}</ion-text>
                <ion-text class="atd__config__content__item__value">{{ this.profile }}</ion-text>
              </ion-label>
            </ion-item>
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{ 'funds.fund_timeline_detail.config_card.item.take_profit' | translate }}</ion-text>
                <ion-text class="atd__config__content__item__value">{{ this.fund?.ganancia }}%</ion-text>
              </ion-label>
            </ion-item>
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{ 'funds.fund_timeline_detail.config_card.item.stop_loss' | translate }}</ion-text>
                <ion-text class="atd__config__content__item__value">-{{ this.fund?.perdida }}%</ion-text>
              </ion-label>
            </ion-item>
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{ 'funds.fund_timeline_detail.config_card.item.currency' | translate }}</ion-text>
                <ion-text class="atd__config__content__item__value">{{ this.fund?.currency }}</ion-text>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-timeline-detail.page.scss'],
})
export class FundTimelineDetailPage implements OnInit {
  fundName: string;
  runID: string;
  fund: any;
  fundPercentageEvolution: FundPercentageEvolutionChartInterface;
  isChart: boolean;
  profile: string;

  constructor(private translate: TranslateService, private route: ActivatedRoute, private apiFunds: ApiFundsService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.runID = this.route.snapshot.paramMap.get('runID');
    this.getTimelineDetailInfo();
  }

  getTimelineDetailInfo() {
    this.apiFunds.getLastPercentage(this.fundName, this.runID).subscribe((data) => {
      this.fund = data[0];
      this.profile = this.getProfileName(this.fund.nivel_de_riesgo);
    });
    this.getFundPerformanceCardInfo();
  }

  getFundPerformanceCardInfo() {
    this.apiFunds.getPercentageEvolution(this.fundName, this.runID, '', '1d', false).subscribe((data) => {
      if (data.percentage_evolution) {
        data.percentage_evolution.take_profit = data.fund.ganancia;
        data.percentage_evolution.stop_loss = data.fund.perdida;
        this.isChart = true;
      }
      this.fundPercentageEvolution = data.percentage_evolution;
    });
  }

  getProfileName(profile) {
    let response = profile;
    if (
      profile === 'volume_profile_strategies_USDT' ||
      profile === 'volume_profile_strategies_BTC' ||
      profile === 'DeFi_index' ||
      profile === 'Mary_index'
    ) {
      const translateCode = `funds.fund_investment.card.profiles.${profile}.title`;
      response = this.translate.instant(translateCode);
    }
    return response;
  }
}
