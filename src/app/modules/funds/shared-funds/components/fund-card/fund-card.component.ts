import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-fund-card',
  template: `
    <div class="fc">
      <div class="fc__main ion-padding">
        <div
          class="fc__main__title ux-font-lato ux-fweight-semibold ux-fsize-12"
        >
          <ion-text color="uxdark">
            {{ this.fund?.fund_name }}
          </ion-text>
        </div>
        <div class="fc__main__content" *ngIf="this.fund?.end_balance">
          <div class="fc__main__content__left">
            <div class="ux-font-gilroy ux-fsize-24 ux-fweight-extrabold">
              <ion-text color="uxdark">
                {{
                  this.fund?.end_balance
                    | currencyFormat
                      : {
                          currency: this.fund?.currency,
                          formatUSDT: '1.2-2',
                          formatBTC: '1.2-4'
                        }
                }}
              </ion-text>
            </div>
            <div class="ux-font-lato ux-fweight-regular ux-fsize-12">
              <ion-text color="uxmedium">
                {{ 'funds.fund_card.current_capital' | translate }}
              </ion-text>
            </div>
          </div>
          <div class="fc__main__content__right">
            <div class="ux-font-gilroy ux-fsize-24 ux-fweight-extrabold">
              <ion-icon
                class="fc__main__content__right__amount__up"
                name="ux-triangle-up"
                *ngIf="this.fund?.total_profit > 0"
              ></ion-icon>
              <ion-icon
                class="fc__main__content__right__amount__down"
                name="ux-triangle-down"
                *ngIf="this.fund?.total_profit < 0"
              ></ion-icon>
              <ion-text color="uxdark"
                >{{
                  this.fund?.total_profit * 100 | absoluteValue | number: '1.2-2'
                }}%
              </ion-text>
            </div>
            <div class="ux-font-lato ux-fweight-regular ux-fsize-12 fc__main__content__right__flex">
              <ion-text color="uxmedium">
                {{ this.getDays(this.fund) }}
                {{ 'funds.fund_card.days' | translate }}
              </ion-text>
            </div>
          </div>
        </div>
        <div
          *ngIf="!this.fund?.end_balance"
          class="fl__total__amount ux-font-lato ux-fweight-regular ux-fsize-14"
        >
          <ion-text>
            {{ 'funds.fund_card.not_balance_found' | translate }}
          </ion-text>
        </div>
      </div>
      <div class="fc__footer">
        <ion-button
          appTrackClick
          name="View Fund"
          (click)="this.viewFund()"
          fill="clear"
          size="small"
          class="fc__footer__view_fund ux-font-lato ux-fweight-semibold ux-fsize-14"
          [disabled]="!this.fund.end_balance"
        >
          {{ 'funds.fund_card.view_fund' | translate }}
          <ion-icon slot="end" name="ux-forward"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./fund-card.component.scss'],
})
export class FundCardComponent implements OnInit {
  @Input() fund: any;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  viewFund() {
    this.navController.navigateRoot(['funds/detail', this.fund.fund_name]);
  }

  getDays(fund) {
    let a = moment(fund.start_time);
    let b = moment(fund.end_time);

    return b.diff(a, 'days');
  }
}
