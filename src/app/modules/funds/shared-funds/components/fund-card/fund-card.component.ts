import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-fund-card',
  template: `
    <div class="fc" (click)="this.actionFund()">
      <div class="fc__main ion-padding">
        <div
          [ngClass]="{
            fc__main__title: fund.state === 'active',
            'fc__main__title-finalized': fund.state === 'finalizado'
          }"
          class="fc__main__title ux-font-lato ux-fweight-semibold ux-fsize-12"
        >
          <ion-text>
            {{ this.fund?.fund_name }}
          </ion-text>
          <ion-text class="fc__main__title__strategy" color="uxmedium">
            {{ this.fund?.profile | strategyName }}
          </ion-text>
        </div>
        <div class="fc__main__content" *ngIf="this.fund?.end_balance">
          <div class="fc__main__content__left">
            <div
              [ngClass]="{
                fc__main__content__left__balance: fund.state === 'active',
                'fc__main__content__left__balance-finalized': fund.state === 'finalizado'
              }"
              class="ux-font-gilroy ux-fsize-24 ux-fweight-extrabold"
            >
              <ion-text>
                {{
                  this.fund?.end_balance
                    | currencyFormat
                      : {
                          currency: this.fund?.currency,
                          formatUSDT: '1.2-2',
                          formatBTC: '1.2-4'
                        }
                    | hideText: this.hideFundText
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
                [ngClass]="{
                  fc__main__content__right__amount__up: fund.state === 'active',
                  'fc__main__content__right__amount__up-finalized': fund.state === 'finalizado'
                }"
                name="ux-triangle-up"
                *ngIf="this.fund?.total_profit > 0"
              ></ion-icon>
              <ion-icon
                [ngClass]="{
                  fc__main__content__right__amount__down: fund.state === 'active',
                  'fc__main__content__right__amount__down-finalized': fund.state === 'finalizado'
                }"
                name="ux-triangle-down"
                *ngIf="this.fund?.total_profit < 0"
              ></ion-icon>
              <ion-text
                [ngClass]="{
                  fc__main__content__right__performance: fund.state === 'active',
                  'fc__main__content__right__performance-finalized': fund.state === 'finalizado'
                }"
                >{{ this.fund?.total_profit * 100 | absoluteValue | number: '1.2-2' }}%
              </ion-text>
            </div>
            <div class="ux-font-lato ux-fweight-regular ux-fsize-12 fc__main__content__right__flex">
              <ion-text color="uxmedium">
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
          </div>
        </div>
        <div *ngIf="!this.fund?.end_balance" class="fl__total__amount ux-font-lato ux-fweight-regular ux-fsize-14">
          <ion-text>
            {{ 'funds.fund_card.not_balance_found' | translate }}
          </ion-text>
        </div>
      </div>
      <div class="fc__footer" *ngIf="this.fund.state === 'active'">
        <div class="fc__footer__left"></div>
        <div class="fc__footer__right" *ngIf="this.fund.state === 'active'">
          <ion-button
            name="View Fund"
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
      <div class="fc__footer" *ngIf="this.fund.state === 'finalizado'">
        <div class="fc__footer__left">
          <ion-text class="fc__footer__finalized-label ux-font-lato ux-fweight-semibold ux-fsize-14">
            {{ 'funds.fund_card.finalized' | translate }}
          </ion-text>
        </div>
        <div class="fc__footer__right">
          <ion-button
            name="Renovate Fund"
            fill="clear"
            size="small"
            class="fc__footer__renovate_fund ux-font-lato ux-fweight-semibold ux-fsize-14"
            [disabled]="!this.fund.end_balance"
          >
            {{ 'funds.fund_card.renovate' | translate }}
            <ion-icon slot="end" name="ux-forward"></ion-icon>
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./fund-card.component.scss'],
})
export class FundCardComponent implements OnInit {
  @Input() fund: any;
  @Input() hideFundText: boolean;
  createdTime: any;
  constructor(
    private navController: NavController,
    private localStorageService: LocalStorageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.subscribeOnHideFunds();
    this.createdTime = this.getCreatedTime(this.fund);
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  actionFund() {
    if (this.fund.state === 'active') {
      this.navController.navigateRoot(['funds/detail', this.fund.fund_name]);
    } else if (this.fund.state === 'finalizado') {
      this.navController.navigateRoot(['funds/funds-finished']);
    }
  }

  getCreatedTime(fund) {
    const a = moment(fund.start_time);
    const b = moment(fund.end_time);

    if (b.diff(a, 'days') > 0) {
      return ['days', b.diff(a, 'days')];
    } else if (b.diff(a, 'hours') > 0) {
      return ['hours', b.diff(a, 'hours')];
    } else if (b.diff(a, 'minutes') > 0) {
      return ['minutes', b.diff(a, 'minutes')];
    } else {
      return ['seconds', b.diff(a, 'seconds')];
    }
  }
}
