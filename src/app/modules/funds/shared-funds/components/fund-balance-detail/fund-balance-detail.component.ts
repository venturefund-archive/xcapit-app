import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-fund-balance-detail',
  template: `
    <div class="fbd__header">
      <ion-text
        class="fbd__header__text ux-font-gilroy ux-fweight-extrabold ux-fsize-22"
      >
        {{
          'funds.fund_detail.fund_portfolio_card.fund_balance_detail_title'
            | translate
        }}
      </ion-text>
      <ion-button
        appTrackClick
        name="Close"
        [dataToTrack]="{
          description:
            'funds.fund_detail.fund_portfolio_card.fund_balance_detail_title'
            | translate
        }"
        (click)="this.close()"
        fill="clear"
        size="small"
        color="uxsemidark"
        class="fbd__header__close"
      >
        <ion-icon name="close"></ion-icon>
      </ion-button>
    </div>
    <ion-content>
      <div class="fbd__content">
        <div class="fbd__content__items">
          <app-fund-balance-detail-item
            *ngFor="let item of this.orderedPortfolio"
            [item]="item"
            [currency]="this.currency"
          ></app-fund-balance-detail-item>
        </div>
        <div class="fbd__content__dates ion-padding">
          <ion-text
            class="ux-font-lato ux-fweight-regular ux-fsize-14"
            color="uxsemidark"
            >
            {{
              'funds.fund_detail.fund_portfolio_card.fund_balance_detail_period_begin'
                | translate
            }}
            {{ this.startDate | date: 'dd/MM/yyyy' }}</ion-text
          >
          <ion-text
            class="ux-font-lato ux-fweight-regular ux-fsize-14"
            color="uxsemidark"
            >{{
              'funds.fund_detail.fund_portfolio_card.fund_balance_detail_last_update'
                | translate
            }}
            {{ this.endDate | date: 'dd/MM/yyyy' }} </ion-text
          >
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-balance-detail.component.scss']
})
export class FundBalanceDetailComponent implements OnInit {
  orderedPortfolio: any[];
  startDate: any;
  endDate: any;
  currency: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss();
  }
}
