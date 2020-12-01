import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { CONFIG } from 'src/app/config/app-constants.config';

@Component({
  selector: 'app-fund-operations-history',
  template: `
    <ion-header class="foh">
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="funds/detail/{{ this.fundName }}"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="foh__header-title ion-text-center">
          {{ 'funds.fund_operations.title' | translate }}</ion-title
        >
        <ion-title class="foh__header-fund ion-text-center">{{
          this.fundName
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div>
        <app-ux-date-range>
          <div class="foc">
            <div class="foc__date">
              <div class="foc__date__label">
                <ion-label
                  color="uxmedium"
                  class="ux-font-lato ux-fweight-regular ux-fsize-12"
                >
                  <ion-text>
                    {{ 'funds.fund_operations.since_date_range' | translate }}:
                  </ion-text>
                </ion-label>
              </div>
              <div class="foc__date__datetime-section">
                <ion-icon [name]="'ux-calendar'"></ion-icon>
                <ion-datetime
                  class="ux-font-lato ux-fweight-regular ux-fsize-12"
                  value="{{ this.queryOptions.since }}"
                  display-format="YYYY-MM-DD"
                  cancelText="{{ this.datepicker.cancelText }}"
                  doneText="{{ this.datepicker.doneText }}"
                  (ionChange)="this.changeDate($event, 'since')"
                ></ion-datetime>
              </div>
            </div>
            <div class="foc__date">
              <div class="foc__date__label">
                <ion-label
                  color="uxmedium"
                  class="ux-font-lato ux-fweight-regular ux-fsize-12"
                >
                  {{ 'funds.fund_operations.until_date_range' | translate }}:
                </ion-label>
              </div>
              <div class="foc__date__datetime-section">
                <ion-icon [name]="'ux-calendar'"></ion-icon>
                <ion-datetime
                  class="ux-font-lato ux-fweight-regular ux-fsize-12"
                  value="{{ this.queryOptions.until }}"
                  display-format="YYYY-MM-DD"
                  cancelText="{{ this.datepicker.cancelText }}"
                  doneText="{{ this.datepicker.doneText }}"
                  (ionChange)="this.changeDate($event, 'until')"
                ></ion-datetime>
              </div>
            </div>
          </div>
        </app-ux-date-range>
      </div>
      <div class="fol">
        <app-ux-list-inverted>
          <ion-list>
            <ion-item
              class="fol__headers ux-font-lato ux-fweight-regular ux-fsize-11"
            >
              <ion-label class="fol__headers__label-left">
                {{ 'funds.fund_operations.header_pair' | translate }}
              </ion-label>
              <ion-label class="fol__headers__label-center">
                {{ 'funds.fund_operations.header_price' | translate }}
              </ion-label>
              <ion-label class="fol__headers__label-right">
                {{ 'funds.fund_operations.header_qty' | translate }}
              </ion-label>
            </ion-item>
            <div
              class="container fol__list"
              *ngFor="let order of this.orders; let last = last"
            >
              <ion-item
                (click)="viewOrderDetail(order.id)"
                class="ux-font-lato ux-fweight-regular ux-fsize-12"
              >
                <ion-label class="fol__list__pair">
                  <app-symbol-format
                    [symbol]="this.order.symbol"
                    *ngIf="this.order.symbol"
                  ></app-symbol-format>

                  <ion-text
                    *ngIf="order.side == 'buy'"
                    class="fol__list__pair__type__buy ux-fweight-semibold"
                    >{{
                      'funds.fund_operations.order_side_buy' | translate
                    }}</ion-text
                  >
                  <ion-text
                    *ngIf="order.side == 'sell'"
                    class="fol__list__pair__type__sell ux-fweight-semibold"
                    >{{
                      'funds.fund_operations.order_side_sell' | translate
                    }}</ion-text
                  >
                  <h3>
                    {{ order.creation_datetime | date: 'dd-MM-yy HH:mm:ss' }}
                  </h3>
                </ion-label>
                <ion-label class="fol__list__price">
                  {{ order.price | number: '1.2-6' }}
                  <h3 *ngIf="order.order_type == 'market'">
                    {{ 'funds.fund_operations.order_type_market' | translate }}
                  </h3>
                </ion-label>

                <ion-label class="fol__list__qty">
                  {{ order.executedQty }}
                </ion-label>
              </ion-item>
              <div class="list-divider" *ngIf="!last"></div>
            </div>
          </ion-list>
        </app-ux-list-inverted>
      </div>
      <ion-infinite-scroll threshold="200px" (ionInfinite)="this.loadMore()">
        <ion-infinite-scroll-content
          loadingSpinner="bubbles"
          loadingText="{{
            'funds.fund_operations.loading_infinite_scroll' | translate
          }}"
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  `,
  styleUrls: ['./fund-operations.page.scss'],
})
export class FundOperationsPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  orders: any[] = [];
  queryOptions = { ordering: '-creation_datetime', since: '', until: '' };
  paginationOptions = { cursor: '' };
  loading = true;
  fundName: string;
  datepicker = {
    cancelText: '',
    doneText: '',
  };
  storage_since = '';
  storage_until = '';

  constructor(
    private apiFunds: ApiFundsService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private storage: Storage
  ) {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.params.fundName;
    this.getStorageDates();
    this.setInitialDatePicker();
  }
  ionViewDidEnter() {
    this.getOperationsHistory(this.getQueryParams());
  }

  setInitialDatePicker() {
    if (this.storage_since != '') {
      this.queryOptions.since = this.storage_since;
    } else {
      this.queryOptions.since = moment()
        .subtract(7, 'd')
        .startOf('day')
        .format();
    }
    if (this.storage_until != '') {
      this.queryOptions.until = this.storage_until;
    } else {
      this.queryOptions.until = moment().endOf('day').format();
    }

    this.datepicker.cancelText = this.translate.instant(
      'funds.fund_operations.cancel_datepicker_text'
    );
    this.datepicker.doneText = this.translate.instant(
      'funds.fund_operations.done_datepicker_text'
    );
  }
  getOperationsHistory(options: any = null, hasInfiniteScroll?: boolean) {
    this.apiFunds
      .getOperationsHistory(this.fundName, options)
      .subscribe((data) => {
        this.paginationOptions.cursor =
          (data.cursors && data.cursors.next) || '';
        if (hasInfiniteScroll) {
          this.orders = [...this.orders, ...data.results];
          this.infiniteScroll.complete();
        } else {
          this.orders = data.results;
        }
        this.loading = false;
        this.infiniteScroll.disabled = !this.paginationOptions.cursor;
      });
  }

  loadMore() {
    if (this.paginationOptions.cursor) {
      this.getOperationsHistory(this.getQueryParams(), true);
    }
  }

  private getQueryParams() {
    return {
      ...this.queryOptions,
      ...this.paginationOptions,
    };
  }

  async changeDate(event, type) {
    if (type === 'since') {
      this.queryOptions.since = event.detail.value;
    }
    if (type === 'until') {
      this.queryOptions.until = event.detail.value;
    }
    this.getOperationsHistory(this.getQueryParams());
  }

  viewOrderDetail(id) {
    let order = this.orders.find((x) => x.id === id);
    this.router.navigate(['funds/fund-operations-detail', order.id]);
  }

  async getStorageDates() {
    this.storage_since = await this.storage.get(
      CONFIG.operationHistoryDates.since
    );
    this.storage_until = await this.storage.get(
      CONFIG.operationHistoryDates.until
    );
  }

  async setDatesInStorage(since = undefined, until = undefined) {
    if (since) {
      await this.storage.set(
        CONFIG.operationHistoryDates.since,
        this.queryOptions.since
      );
    }
    if (until) {
      await this.storage.set(
        CONFIG.operationHistoryDates.until,
        this.queryOptions.until
      );
    }
  }

  ngOnInit() {}

  ionViewWillLeave(){
    this.setDatesInStorage(this.queryOptions.since, this.queryOptions.until);
    this.getStorageDates();
  }
}
