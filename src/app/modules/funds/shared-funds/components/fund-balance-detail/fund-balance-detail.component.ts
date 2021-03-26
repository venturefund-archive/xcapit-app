import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    <ion-content class="fbd__main_content">
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
            }}: {{ this.startDate | date: 'dd/MM/yyyy' }}</ion-text
          >
          <ion-text
            class="ux-font-lato ux-fweight-regular ux-fsize-14"
            color="uxsemidark"
            >{{
              'funds.fund_detail.fund_portfolio_card.fund_balance_detail_last_update'
                | translate
            }}: {{ this.endDate | date: 'dd/MM/yyyy' }}
          </ion-text>
        </div>
        <div class="fbd__content__history ion-padding" *ngIf="this.isOwner">
          <ion-button
            name="View Operation History"
            (click)="this.viewOperations()"
            fill="clear"
            size="small"
            class="fbd__content__history__button ux-font-lato ux-fweight-semibold ux-fsize-14"
          >
          {{'funds.fund_detail.fund_portfolio_card.view_operation_history'| translate}}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-balance-detail.component.scss'],
})
export class FundBalanceDetailComponent implements OnInit {
  orderedPortfolio: any[];
  startDate: any;
  endDate: any;
  currency: string;
  fundName: string;
  isOwner: any;

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss();
  }

  viewOperations() {
    this.close();
    this.router.navigate(['funds/fund-operations', this.fundName], { replaceUrl: true });
  }
}
