import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fund-operations-history',
  template: `
    <ion-header class="foh">
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="funds/fund-operations/{{ this.fundName }}"></ion-back-button>
        </ion-buttons>
        <div>
          <ion-title class="foh__header-title"> {{ 'funds.fund_operations_detail.title' | translate }}</ion-title>
          <ion-title class="foh__header-fund">{{ this.fundName }}</ion-title>
        </div>
        <!-- Comentado hasta la implementación del filtro -->
        <!-- <ion-buttons slot="end">
          <ion-button
            class="ux-font-text-xs semibold ion-padding-end"
            appTrackClick
            name="Filter Orders"
          >
            <ion-icon name="funnel-outline"></ion-icon>
          </ion-button>
        </ion-buttons> -->
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="fodc">
        <app-ux-list-inverted *ngIf="this.order">
          <ion-list>
            <ion-item class="fodc__header">
              <div>
                <ion-text class="fodc__header__symbol ux-font-text-xxs regular">
                  {{ order.symbol }}
                </ion-text>
                <ion-text *ngIf="order.side === 'buy'" class="fodc__header__buy operation-type">{{
                  'funds.fund_operations.order_side_buy' | translate
                }}</ion-text>
                <ion-text *ngIf="order.side === 'sell'" class="fodc__header__sell operation-type">{{
                  'funds.fund_operations.order_side_sell' | translate
                }}</ion-text>
              </div>
            </ion-item>
            <div class="container fodc__content">
              <ion-item-group class="fodc__content__block ux-font-text-xxs regular">
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">{{
                    'funds.fund_operations_detail.order_type_label' | translate
                  }}</ion-label>
                  <ion-label class="fodc__align_right fodc__margin">{{ order.order_type | titlecase }}</ion-label>
                </ion-item>
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">{{
                    'funds.fund_operations_detail.quantity' | translate
                  }}</ion-label>
                  <ion-label class="fodc__align_right fodc__margin"
                    ><ion-text color="uxsemidark">{{ order.origQty | number: '1.2-6' }} </ion-text
                    ><ion-text> / {{ order.executedQty | number: '1.2-6' }}</ion-text></ion-label
                  >
                </ion-item>
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">{{
                    'funds.fund_operations_detail.price' | translate
                  }}</ion-label>
                  <ion-label class="fodc__align_right fodc__margin">
                    <ion-text> {{ order.price | number: '1.2-6' }}</ion-text>
                    <ion-text *ngIf="order.order_type === 'market'">
                      /
                      {{ 'funds.fund_operations_detail.order_type_market' | translate }}
                    </ion-text>
                  </ion-label>
                </ion-item>
              </ion-item-group>
              <div class="list-divider"></div>
              <ion-item-group class="item-group ux-font-text-xs">
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">Fee</ion-label>
                  <ion-label class="fodc__align_right fodc__margin">{{ order.fee_cost | number: '1.2-6' }}</ion-label>
                </ion-item>
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">
                    {{ 'funds.fund_operations_detail.fee_currency' | translate }}</ion-label
                  >
                  <ion-label class="fodc__align_right fodc__margin">{{ order.fee_currency }}</ion-label>
                </ion-item>
              </ion-item-group>
              <div class="list-divider"></div>
              <ion-item-group class="ux-font-text-xxs">
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">{{
                    'funds.fund_operations_detail.status' | translate
                  }}</ion-label>
                  <ion-label class="fodc__align_right fodc__margin">
                    <ion-text *ngIf="order.status === 'closed'">
                      {{ 'funds.fund_operations_detail.status_closed' | translate }}
                    </ion-text></ion-label
                  >
                </ion-item>
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">{{
                    'funds.fund_operations_detail.date' | translate
                  }}</ion-label>
                  <ion-label class="fodc__align_right fodc__margin">{{
                    order.creation_datetime | localizedDate
                  }}</ion-label>
                </ion-item>
              </ion-item-group>
            </div>
          </ion-list>
        </app-ux-list-inverted>
        <app-ux-loading-block *ngIf="!this.order" minSize="60px"></app-ux-loading-block>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-operations-detail.page.scss'],
})
export class FundOperationsDetailPage implements OnInit {
  order: any;
  loading = true;
  fundName: string;
  orderId: string;

  constructor(private apiFunds: ApiFundsService, private route: ActivatedRoute) {}

  ionViewWillEnter() {
    this.orderId = this.route.snapshot.params.orderID;
  }
  ionViewDidEnter() {
    this.getOrder();
  }

  getOrder() {
    this.order = {
      id: 1,
      symbol: 'USDT/BTC',
      side: 'buy',
      price: 123.4,
      order_type: 'market',
      executedQty: 245,
      creation_datetime: new Date(),
    };
    this.fundName = 'hola';
    this.loading = false;
    // this.apiFunds.getOrderDetail(this.orderId, this.loading).subscribe((data) => {
    //   this.order = data;
    //   this.fundName = data.fund_name;
    //   this.loading = false;
    // });
  }

  ngOnInit() {}
}
