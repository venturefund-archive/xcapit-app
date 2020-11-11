import { Component, OnInit, Input } from '@angular/core';
import { FundMetricsInterface } from './fund-metrics.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-metrics-card',
  template: `
    <div class="fmc">
      <div class="fmc__content">
        <div
          class="fmc__content__right ion-padding-top ion-padding-start ion-padding-bottom"
        >
          <!-- Ganancia en Moneda   -->
          <div class="item">
            <ion-text
              class="item__title ux-font-lato ux-fweight-regular ux-fsize-12"
              color="uxmedium"
            >
              {{
                'funds.fund_detail.fund_metrics_card.profit'
                  | translate
                    : {
                        currency: this.currency
                      }
              }}
            </ion-text>
            <ion-text
              class="item__value ux-font-lato ux-fweight-semibold ux-fsize-14"
              color="uxdark"
            >
              {{ this.metrics.cumulative_return | number: '1.2-2' }} %
            </ion-text>
          </div>

          <!-- Sharpe   -->
          <div class="item second">
            <ion-text
              class="item__title ux-font-lato ux-fweight-regular ux-fsize-12"
              color="uxmedium"
            >
              {{ 'funds.fund_detail.fund_metrics_card.sharpe' | translate }}
            </ion-text>
            <ion-text
              class="item__value ux-font-lato ux-fweight-semibold ux-fsize-14"
              color="uxdark"
            >
              {{ this.metrics.sharpe | number: '1.2-2' }}
            </ion-text>
          </div>
        </div>
        <div
          class="fmc__content__right ion-padding-top ion-padding-end ion-padding-bottom"
        >
          <!-- Mayor caida   -->
          <div class="item">
            <ion-text
              class="item__title ux-font-lato ux-fweight-regular ux-fsize-12"
              color="uxmedium"
            >
              {{
                'funds.fund_detail.fund_metrics_card.max_drawdown' | translate
              }}
            </ion-text>
            <ion-text
              class="item__value ux-font-lato ux-fweight-semibold ux-fsize-14"
              color="uxdark"
            >
              {{ this.metrics.max_drawdown | number: '1.2-2' }} %
            </ion-text>
          </div>

          <!-- Recupero mas largo   -->
          <div class="item second">
            <ion-text
              class="item__title ux-font-lato ux-fweight-regular ux-fsize-12"
              color="uxmedium"
            >
              {{
                'funds.fund_detail.fund_metrics_card.longest_drawdown'
                  | translate
              }}
            </ion-text>
            <ion-text
              class="item__value ux-font-lato ux-fweight-semibold ux-fsize-14"
              color="uxdark"
            >
              {{ this.metrics.longest_drawdown | number: '1.0' }}
              {{
                'funds.fund_detail.fund_metrics_card.longest_drawdown_metric'
                  | translate
              }}
            </ion-text>
          </div>
        </div>
      </div>
      <div class="fmc__clarification">
        <div class="fmc__clarification__icon"></div>
        <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12" color="uxmedium">{{
          'funds.fund_detail.fund_metrics_card.clarification' | translate
        }}</ion-text>
      </div>
      <div class="fmc__footer">
        <ion-button
          appTrackClick
          name="View Details"
          (click)="this.viewAdvancedFund()"
          fill="clear"
          size="small"
          class="fmc__footer__advanced-button ux-font-lato ux-fweight-semibold ux-fsize-14"
        >
          {{ 'funds.fund_detail.fund_metrics_card.advanced' | translate }}
          <ion-icon slot="end" name="ux-forward"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./fund-metrics-card.component.scss'],
})
export class FundMetricsCardComponent implements OnInit {
  @Input() metrics: FundMetricsInterface;
  @Input() currency: string;
  @Input() fundName: string;

  constructor(private navController: NavController) {

  }

  ngOnInit() {}

  viewAdvancedFund() {
    this.navController.navigateForward(['funds/advanced', this.fundName]);
  }
}
