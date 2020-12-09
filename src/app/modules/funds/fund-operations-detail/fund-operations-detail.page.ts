import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fund-operations-history',
  template: `
    <ion-header class="foh">
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="funds/fund-operations/{{ this.fundName }}"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="foh__header-title ion-text-center">
          {{ 'funds.fund_operations_detail.title' | translate }}</ion-title
        >
        <ion-title class="foh__header-fund ion-text-center">{{
          this.fundName
        }}</ion-title>
        <!-- Comentado hasta la implementación del filtro -->
        <!-- <ion-buttons slot="end">
          <ion-button
            class="ux-font-lato ux-fweight-semibold ux-fsize-14 ion-padding-end"
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
                <ion-text
                  class="fodc__header__symbol ux-font-lato ux-fweight-regular ux-fsize-12"
                >
                  {{ order.symbol }}
                </ion-text>
                <ion-text
                  *ngIf="order.side == 'buy'"
                  class="fodc__header__buy ux-font-lato ux-fweight-semibold"
                  >{{
                    'funds.fund_operations.order_side_buy' | translate
                  }}</ion-text
                >
                <ion-text
                  *ngIf="order.side == 'sell'"
                  class="fodc__header__sell ux-font-lato ux-fweight-semibold"
                  >{{
                    'funds.fund_operations.order_side_sell' | translate
                  }}</ion-text
                >
              </div>
            </ion-item>
            <div class="container fodc__content">
              <ion-item-group
                class="fodc__content__block ux-font-lato ux-fweight-regular ux-fsize-12"
              >
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">{{
                    'funds.fund_operations_detail.order_type_label' | translate
                  }}</ion-label>
                  <ion-label class="fodc__align_right fodc__margin">{{
                    order.order_type | titlecase
                  }}</ion-label>
                </ion-item>
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">{{
                    'funds.fund_operations_detail.quantity' | translate
                  }}</ion-label>
                  <ion-label class="fodc__align_right fodc__margin"
                    ><ion-text color="uxsemidark"
                      >{{ order.origQty | number: '1.2-6' }} </ion-text
                    ><ion-text>
                      / {{ order.executedQty | number: '1.2-6' }}</ion-text
                    ></ion-label
                  >
                </ion-item>
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">{{
                    'funds.fund_operations_detail.price' | translate
                  }}</ion-label>
                  <ion-label class="fodc__align_right fodc__margin">
                    <ion-text> {{ order.price | number: '1.2-6' }}</ion-text>
                    <ion-text *ngIf="order.order_type == 'market'">
                      /
                      {{
                        'funds.fund_operations_detail.order_type_market'
                          | translate
                      }}
                    </ion-text>
                  </ion-label>
                </ion-item>
              </ion-item-group>
              <div class="list-divider"></div>
              <ion-item-group
                class="ux-font-lato ux-fweight-regular ux-fsize-12"
              >
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin"
                    >Fee</ion-label
                  >
                  <ion-label class="fodc__align_right fodc__margin">{{
                    order.fee_cost | number: '1.2-6'
                  }}</ion-label>
                </ion-item>
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">
                    {{
                      'funds.fund_operations_detail.fee_currency' | translate
                    }}</ion-label
                  >
                  <ion-label class="fodc__align_right fodc__margin">{{
                    order.fee_currency
                  }}</ion-label>
                </ion-item>
              </ion-item-group>
              <div class="list-divider"></div>
              <ion-item-group
                class="ux-font-lato ux-fweight-regular ux-fsize-12"
              >
                <ion-item class="fodc__content__block__item">
                  <ion-label class="fodc__align_left fodc__margin">{{
                    'funds.fund_operations_detail.status' | translate
                  }}</ion-label>
                  <ion-label class="fodc__align_right fodc__margin">
                    <ion-text *ngIf="order.status == 'closed'">
                      {{
                        'funds.fund_operations_detail.status_closed' | translate
                      }}
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
        <app-ux-loading-block
          *ngIf="!this.order"
          minSize="60px"
        ></app-ux-loading-block>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-operations-detail.page.scss'],
})
export class FundOperationsDetailPage implements OnInit {
  order: any;
  loading = true;
  fundName: string;
  order_id: string;

  constructor(
    private apiFunds: ApiFundsService,
    private route: ActivatedRoute
  ) {}

  ionViewWillEnter() {
    this.order_id = this.route.snapshot.params.orderID;
  }
  ionViewDidEnter() {
    this.getOrder();
  }

  getOrder() {
    this.apiFunds
      .getOrderDetail(this.order_id, this.loading)
      .subscribe((data) => {
        this.order = data;
        this.fundName = data.fund_name;
        this.loading = false;
      });
  }

  ngOnInit() {}
}
