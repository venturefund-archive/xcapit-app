import { Component, OnInit, Input } from '@angular/core';
import { FundMetricsInterface } from './fund-metrics.interface';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fund-metrics-card',
  template: `
    <div class="fmc">
      <div class="fmc__content">
        <div class="fmc__content__right ion-padding-top ion-padding-start ion-padding-bottom">
          <!-- Período -->
          <div class="item">
            <ion-text class="item__title ux-font-lato ux-fweight-regular ux-fsize-12" color="uxmedium">
              {{ 'funds.fund_detail.fund_metrics_card.period' | translate }}
            </ion-text>
            <ion-text class="item__value ux-font-lato ux-fweight-semibold ux-fsize-14" color="uxdark">
              {{
                'funds.fund_card.' + this.createdTime[0]
                  | translate
                    : {
                        value: this.createdTime[1],
                        s: this.createdTime[1] !== 1 ? 's' : ''
                      }
              }}
            </ion-text>
          </div>

          <!-- Take profit -->
          <div class="item second">
            <ion-text class="item__title ux-font-lato ux-fweight-regular ux-fsize-12" color="uxmedium">
              {{ 'funds.fund_detail.fund_metrics_card.take_profit' | translate }}
            </ion-text>
            <ion-text class="item__value ux-font-lato ux-fweight-semibold ux-fsize-14" color="uxdark">
              {{ this.settings?.ganancia }}%
            </ion-text>
          </div>

          <!-- Estrategia -->
          <div class="item second">
            <ion-text class="item__title ux-font-lato ux-fweight-regular ux-fsize-12" color="uxmedium">
              {{ 'funds.fund_detail.fund_metrics_card.strategy' | translate }}
            </ion-text>
            <ion-text class="item__value ux-font-lato ux-fweight-semibold ux-fsize-14" color="uxdark">
              {{ this.settings?.nivel_de_riesgo | strategyName }}
            </ion-text>
          </div>
        </div>
        <div class="fmc__content__right ion-padding-top ion-padding-end ion-padding-bottom">
          <!-- Rendimiento -->
          <div class="item">
            <ion-text class="item__title ux-font-lato ux-fweight-regular ux-fsize-12" color="uxmedium">
              {{ 'funds.fund_detail.fund_metrics_card.performance' | translate }}
            </ion-text>
            <div>
              <ion-icon
                class="fmc__content__right__amount__up"
                name="ux-triangle-up"
                *ngIf="this.resume?.total_profit > 0"
              ></ion-icon>
              <ion-icon
                class="fmc__content__right__amount__down"
                name="ux-triangle-down"
                *ngIf="this.resume?.total_profit < 0"
              ></ion-icon>
              <ion-text class="item__value ux-font-lato ux-fweight-semibold ux-fsize-14" color="uxdark">
                {{ this.resume?.total_profit * 100 | absoluteValue | number: '1.2-2' }}%
              </ion-text>
            </div>
          </div>

          <!-- Stop loss -->
          <div class="item second">
            <ion-text class="item__title ux-font-lato ux-fweight-regular ux-fsize-12" color="uxmedium">
              {{ 'funds.fund_detail.fund_metrics_card.stop_loss' | translate }}
            </ion-text>
            <ion-text class="item__value ux-font-lato ux-fweight-semibold ux-fsize-14" color="uxdark">
              {{ this.settings?.perdida }}%
            </ion-text>
          </div>

          <!-- Moneda -->
          <div class="item second">
            <ion-text class="item__title ux-font-lato ux-fweight-regular ux-fsize-12" color="uxmedium">
              {{ 'funds.fund_detail.fund_metrics_card.currency' | translate }}
            </ion-text>
            <ion-text class="item__value ux-font-lato ux-fweight-semibold ux-fsize-14" color="uxdark">
              {{ this.settings?.currency }}
            </ion-text>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./fund-metrics-card.component.scss'],
})
export class FundMetricsCardComponent implements OnInit {
  @Input() resume: any;
  @Input() settings: any;
  createdTime: any;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.createdTime = this.getCreatedTime(this.resume);
  }

  getCreatedTime(fund) {
    const startTime = moment(fund.start_time);
    const endTime = moment(fund.end_time);

    if (endTime.diff(startTime, 'days') > 0) {
      return ['days', endTime.diff(startTime, 'days')];
    } else if (endTime.diff(startTime, 'hours') > 0) {
      return ['hours', endTime.diff(startTime, 'hours')];
    } else if (endTime.diff(startTime, 'minutes') > 0) {
      return ['minutes', endTime.diff(startTime, 'minutes')];
    } else {
      return ['seconds', endTime.diff(startTime, 'seconds')];
    }
  }
}
