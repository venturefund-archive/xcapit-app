import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

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
        <div class="fc__main__content">
          <div class="fc__main__content__left">
            <div class="ux-font-gilroy ux-fsize-24 ux-fweight-extrabold">
              <ion-text color="uxdark"
                >{{ this.fund?.balance_fin | number: '1.2-8' }}
                {{ this.fund?.currency }}</ion-text
              >
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
                *ngIf="this.fund?.profit > 0"
              ></ion-icon>
              <ion-icon
                class="fc__main__content__right__amount__down"
                name="ux-triangle-down"
                *ngIf="this.fund?.profit < 0"
              ></ion-icon>
              <ion-text color="uxdark"
                >{{
                  this.fund?.profit * 100 | number: '1.2-2' | absoluteValue
                }}%</ion-text
              >
            </div>
            <div class="ux-font-lato ux-fweight-regular ux-fsize-12">
              <ion-text color="uxmedium">
                {{ 'funds.fund_card.last_24hs' | translate }}
              </ion-text>
            </div>
          </div>
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
        >
          {{ 'funds.fund_card.view_fund' | translate }}
          <ion-icon slot="end" name="ux-forward"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./fund-card.component.scss']
})
export class FundCardComponent implements OnInit {
  @Input() fund: any;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  viewFund() {
    this.navController.navigateRoot(['funds/detail', this.fund.fund_name]);
  }
}
