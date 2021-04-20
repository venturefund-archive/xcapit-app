import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';

@Component({
  selector: 'app-timeline-detail',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/funds/detail/{{ this.fundName }}"
          ></ion-back-button>
        </ion-buttons>
        <div>
          <ion-title class="atd__header-date ion-text-center">
            {{ this.fund?.fecha_inicio | date: 'dd/MM/yy' }}</ion-title
          >
          <ion-title class="atd__header-fund ion-text-center">{{
            this.fundName
          }}</ion-title>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div>
        <div class="atd__chart-card"></div>
        <div class="atd__performance-card">
          <ion-list class="atd__performance-card__content">
            <ion-item class="atd__performance-card__content__item">
              <ion-label>
                <ion-text
                  class="ux-font-lato ux-fweight-regular ux-fsize-12"
                  color="uxsemidark"
                >
                  {{
                    'funds.fund_timeline_detail.performance_card.performance_label'
                      | translate
                  }}
                </ion-text>
              </ion-label>
              <ion-label>
                <ion-text
                  class="ux-font-lato ux-fweight-semibold ux-fsize-10"
                >
                  {{ this.fund?.percentage | number: '1.0-2' }}%
                </ion-text>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
        <div class="atd__config">
          <div class="atd__config__title">
            <ion-text
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              color="uxsemidark"
            >
              {{ 'funds.fund_timeline_detail.config_card.title' | translate }}
            </ion-text>
          </div>
          <ion-list class="atd__config__content">
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{
                  'funds.fund_timeline_detail.config_card.item.state'
                    | translate
                }}</ion-text>
                <ion-text
                  class="atd__config__content__item__value_finalizado"
                  *ngIf="this.fund?.estado == 'finalizado'"
                  >{{
                    'funds.fund_timeline_detail.config_card.item.status_finished'
                      | translate
                  }}</ion-text
                >
                <ion-text
                  class="atd__config__content__item__value_active"
                  *ngIf="this.fund?.estado == 'active'"
                >
                  {{
                    'funds.fund_timeline_detail.config_card.item.status_active'
                      | translate
                  }}</ion-text
                >
              </ion-label>
            </ion-item>
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{
                  'funds.fund_timeline_detail.config_card.item.initial_date'
                    | translate
                }}</ion-text>
                <ion-text class="atd__config__content__item__value">
                  {{ this.fund?.fecha_inicio | date: 'dd/MM/yy' }}
                </ion-text>
              </ion-label>
            </ion-item>
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{
                  'funds.fund_timeline_detail.config_card.item.take_profit'
                    | translate
                }}</ion-text>
                <ion-text class="atd__config__content__item__value"
                  >{{ this.fund?.ganancia }}%</ion-text
                >
              </ion-label>
            </ion-item>
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{
                  'funds.fund_timeline_detail.config_card.item.stop_loss'
                    | translate
                }}</ion-text>
                <ion-text class="atd__config__content__item__value"
                  >-{{ this.fund?.perdida }}%</ion-text
                >
              </ion-label>
            </ion-item>
            <ion-item class="atd__config__content__item">
              <ion-label>
                <ion-text>{{
                  'funds.fund_timeline_detail.config_card.item.currency'
                    | translate
                }}</ion-text>
                <ion-text class="atd__config__content__item__value">{{
                  this.fund?.currency
                }}</ion-text>
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

  constructor(
    private route: ActivatedRoute,
    private apiFunds: ApiFundsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.runID = this.route.snapshot.paramMap.get('runID');
    this.getTimelineDetailInfo();
  }

  getTimelineDetailInfo() {
    this.apiFunds.getLastPercentage(this.fundName).subscribe((data) => {
      this.fund = data.filter((item) => item.id_corrida == this.runID)[0];
    });
  }
}
