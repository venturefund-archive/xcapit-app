import { Component, OnInit, Input } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-fund-card',
  template: `
    <div class="fc">
      <div class="fc__main ion-padding">
        <div
          [ngClass]="{
            fc__main__title: fund.state === 'active',
            'fc__main__title-finalized': fund.state === 'finalizado'
          }"
          class="fc__main__title ux-font-text-xxs"
        >
          <ion-text>
            {{ this.fund?.fund_name }}
          </ion-text>
          <ion-text class="fc__main__title__strategy" color="uxsemidark">
            {{ this.fund?.profile | strategyName }}
          </ion-text>
        </div>
        <div class="fc__main__content" (click)="this.actionFund()" *ngIf="this.fund?.end_balance">
          <div class="fc__main__content__left">
            <div
              [ngClass]="{
                fc__main__content__left__balance: fund.state === 'active',
                'fc__main__content__left__balance-finalized': fund.state === 'finalizado'
              }"
              class="ux-font-text-xl"
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
            <div class="ux-font-text-xxs">
              <ion-text color="uxmedium">
                {{ 'funds.fund_card.current_capital' | translate }}
              </ion-text>
            </div>
          </div>
          <div class="fc__main__content__right">
            <div class="ux-font-text-xl">
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
            <div class="fc__main__content__right__flex">
              <ion-text class="ux-font-text-xxs" color="uxmedium">
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
        <div *ngIf="!this.fund?.end_balance" class="fl__total__amount">
          <ion-text class="ux-font-text-xs">
            {{ 'funds.fund_card.not_balance_found' | translate }}
          </ion-text>
        </div>
      </div>
      <div class="fc__footer" *ngIf="this.fund.state === 'active'">
        <div class="fc__footer__left">
          <ion-button
            *ngIf="!this.owner"
            appTrackClick
            name="Unsubscribe"
            fill="clear"
            size="small"
            (click)="this.askForUnsubscribe()"
          >
            <ion-icon name="ux-trash" color="info"></ion-icon>
          </ion-button>
        </div>
        <div class="fc__footer__right" *ngIf="this.fund.state === 'active'">
          <ion-button
            appTrackClick
            name="View Fund"
            fill="clear"
            size="small"
            class="fc__footer__view_fund ux-font-text-xs"
            [disabled]="!this.fund.end_balance"
            (click)="this.actionFund()"
          >
            {{ 'funds.fund_card.view_fund' | translate }}
            <ion-icon slot="end" name="ux-forward"></ion-icon>
          </ion-button>
        </div>
      </div>
      <div class="fc__footer" *ngIf="this.fund.state === 'finalizado'">
        <div class="fc__footer__left">
          <ion-button
            *ngIf="!this.owner"
            appTrackClick
            name="Unsubscribe"
            fill="clear"
            size="small"
            (click)="this.askForUnsubscribe()"
          >
            <ion-icon name="ux-trash" color="info"></ion-icon>
          </ion-button>
          <ion-text class="fc__footer__finalized-label ux-font-text-xs">
            {{ 'funds.fund_card.finalized' | translate }}
          </ion-text>
        </div>
        <div class="fc__footer__right">
          <ion-button
            appTrackClick
            (click)="this.actionFund()"
            name="Renovate Fund"
            fill="clear"
            size="small"
            class="fc__footer__renovate_fund ux-font-text-xs"
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
  @Input() owner = true;
  createdTime: any[];

  constructor(
    private navController: NavController,
    private localStorageService: LocalStorageService,
    private apiFundsService: ApiFundsService,
    private toastService: ToastService,
    private translate: TranslateService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.subscribeOnHideFunds();
    this.setCreatedTime();
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  actionFund() {
    if (this.fund.state === 'active') {
      this.navController.navigateForward(['funds/detail', this.fund.fund_name]);
    } else if (this.fund.state === 'finalizado') {
      this.navController.navigateForward(['funds/funds-finished']);
    }
  }

  setCreatedTime() {
    const startTime = moment(this.fund.start_time);
    const endTime = moment(this.fund.end_time);
    let createdTime: any[];

    if (endTime.diff(startTime, 'days') > 0) {
      createdTime = ['days', endTime.diff(startTime, 'days')];
    } else if (endTime.diff(startTime, 'hours') > 0) {
      createdTime = ['hours', endTime.diff(startTime, 'hours')];
    } else if (endTime.diff(startTime, 'minutes') > 0) {
      createdTime = ['minutes', endTime.diff(startTime, 'minutes')];
    } else {
      createdTime = ['seconds', endTime.diff(startTime, 'seconds')];
    }

    this.createdTime = createdTime;
  }

  askForUnsubscribe() {
    this.alertController
      .create({
        cssClass: 'ux-alert-confirm',
        header: this.translate.instant('funds.fund_card.unsubscribe_alert_title'),
        buttons: [
          {
            text: this.translate.instant('funds.fund_card.unsubscribe_alert_cancel'),
            role: 'cancel',
            cssClass: 'secondary-button',
          },
          {
            text: this.translate.instant('funds.fund_card.unsubscribe_alert_ok'),
            cssClass: 'primary-button',
            handler: (_) => this.unsubscribe(),
          },
        ],
      })
      .then((alert) => alert.present());
  }

  unsubscribe() {
    this.apiFundsService.unsubscribe(this.fund.fund_name).subscribe(() => this.showSuccessToast());
  }

  showSuccessToast() {
    return this.toastService.showToast({ message: this.translate.instant('funds.fund_card.unsubscribe_toast') });
  }
}
