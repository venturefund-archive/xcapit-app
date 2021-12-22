import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { IonDatetime, IonInfiniteScroll, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { CONFIG } from 'src/app/config/app-constants.config';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { endOfDay, format, parse, parseISO, subDays, toDate } from 'date-fns';

@Component({
  selector: 'app-fund-operations-history',
  template: `
    <ion-header class="foh">
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="funds/detail/{{ this.fundName }}"></ion-back-button>
        </ion-buttons>
        <div>
          <ion-title class="foh__header-title"> {{ 'funds.fund_operations.title' | translate }}</ion-title>
          <ion-title class="foh__header-fund">{{ this.fundName }}</ion-title>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="fdr">
        <div class="fdr__left">
          <ion-label class="ux-font-text-xxs regular">{{
            'funds.fund_operations.since_date_range' | translate
          }}</ion-label>
          <ion-item lines="none">
            <ion-button fill="clear" id="since-datetime">
              <ion-icon color="uxprimary" icon="calendar"></ion-icon>
            </ion-button>
            <ion-input class="ux-font-text-xxs regular" [value]="this.displayDates.since"></ion-input>
            <ion-popover mode="md" side="bottom" trigger="since-datetime" show-backdrop="false">
              <ng-template>
                <ion-datetime
                  id="datetime-since"
                  #sinceDatetime
                  color="uxprimary"
                  presentation="date"
                  (ionChange)="this.formatAndChangeDate($event, 'since')"
                  [max]="this.queryOptions.until"
                  [cancelText]="this.datepicker.cancelText"
                  [doneText]="this.datepicker.doneText"
                ></ion-datetime>
              </ng-template>
            </ion-popover>
          </ion-item>
        </div>
        <div class="fdr__right">
          <ion-label class="ux-font-text-xxs regular">{{
            'funds.fund_operations.until_date_range' | translate
          }}</ion-label>
          <ion-item lines="none">
            <ion-button fill="clear" id="until-datetime">
              <ion-icon color="uxprimary" icon="calendar"></ion-icon>
            </ion-button>
            <ion-input class="ux-font-text-xxs regular" [value]="this.displayDates.until"></ion-input>
            <ion-popover mode="md" side="bottom" trigger="until-datetime" show-backdrop="false">
              <ng-template>
                <ion-datetime
                  id="datetime-until"
                  #untilDatetime
                  presentation="date"
                  color="uxprimary"
                  showDefaultButtons="true"
                  (ionChange)="this.formatAndChangeDate($event, 'until')"
                  [min]="this.queryOptions.since"
                  [max]="this.maxDate"
                  [cancelText]="this.datepicker.cancelText"
                  [doneText]="this.datepicker.doneText"
                ></ion-datetime>
              </ng-template>
            </ion-popover>
          </ion-item>
        </div>
      </div>
      <div class="fol">
        <app-ux-list-inverted>
          <ion-list>
            <ion-item class="fol__headers ux-font-text-xxs regular small">
              <ion-label class="fol__headers__label-left" color="uxsemidark">
                {{ 'funds.fund_operations.header_pair' | translate }}
              </ion-label>
              <ion-label class="fol__headers__label-center" color="uxsemidark">
                {{ 'funds.fund_operations.header_price' | translate }}
              </ion-label>
              <ion-label class="fol__headers__label-right" color="uxsemidark">
                {{ 'funds.fund_operations.header_qty' | translate }}
              </ion-label>
            </ion-item>
            <div class="container fol__list" *ngFor="let order of this.orders; let last = last">
              <ion-item id="view-order-detail" (click)="viewOrderDetail(order.id)" class="ux-font-text-xxs regular">
                <ion-label class="fol__list__pair">
                  <app-symbol-format [symbol]="this.order.symbol" *ngIf="this.order.symbol"></app-symbol-format>
                  <ion-text *ngIf="order.side === 'buy'" class="fol__list__pair__type__buy operation-type">{{
                    'funds.fund_operations.order_side_buy' | translate
                  }}</ion-text>
                  <ion-text *ngIf="order.side === 'sell'" class="fol__list__pair__type__sell operation-type">{{
                    'funds.fund_operations.order_side_sell' | translate
                  }}</ion-text>
                  <h3 color="uxmedium">
                    {{ order.creation_datetime | date: 'dd-MM-yy HH:mm:ss' }}
                  </h3>
                </ion-label>
                <ion-label class="fol__list__price">
                  {{ order.price | number: '1.2-6' }}
                  <h3 *ngIf="order.order_type === 'market'" color="uxmedium">
                    {{ 'funds.fund_operations.order_type_market' | translate }}
                  </h3>
                </ion-label>

                <ion-label class="fol__list__qty">
                  {{ order.executedQty }}
                </ion-label>
              </ion-item>
              <div class="list-divider" *ngIf="!last"></div>
            </div>
            <ion-item *ngIf="!this.orders">
              <app-ux-loading-block minSize="30px"></app-ux-loading-block>
            </ion-item>
          </ion-list>
        </app-ux-list-inverted>
      </div>
      <ion-infinite-scroll threshold="200px" (ionInfinite)="this.loadMore()">
        <ion-infinite-scroll-content
          loadingSpinner="bubbles"
          loadingText="{{ 'funds.fund_operations.loading_infinite_scroll' | translate }}"
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
  displayDates = { since: '', until: '' };
  orders: any[];
  queryOptions = { ordering: '-creation_datetime', since: '', until: '' };
  paginationOptions = { cursor: '' };
  loading = true;
  fundName: string;
  datepicker = {
    cancelText: '',
    doneText: '',
  };
  storageSince = '';
  storageUntil = '';
  maxDate = '';

  constructor(
    private apiFunds: ApiFundsService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private navController: NavController,
    private storage: Storage,
    private loadingService: LoadingService
  ) {}

  async ionViewWillEnter() {
    this.fundName = this.route.snapshot.params.fundName;
    await this.getStorageDates();
    this.setInitialDatePicker();
    this.getOperationsHistory(this.getQueryParams());
  }

  async getStorageDates() {
    await this.loadingService.show();
    this.storageSince = await this.storage.get(CONFIG.operationHistoryDates.since);
    this.storageUntil = await this.storage.get(CONFIG.operationHistoryDates.until);
    await this.loadingService.dismiss();
  }

  formatDate(value) {
    return format(parseISO(value), 'yyyy-MM-dd');
  }

  formatAndChangeDate(event, type) {
    this.changeDate(event, type);
    this.displayDates[type] = event.detail.value;
  }

  setInitialDatePicker() {
    if (this.storageSince) {
      this.queryOptions.since = this.storageSince;
      this.displayDates.since = this.formatDate(this.storageSince);
    } else {
      this.queryOptions.since = subDays(new Date(), 7).toISOString();
      this.displayDates.since = this.formatDate(this.queryOptions.since);
    }

    if (this.storageUntil) {
      this.queryOptions.until = this.storageUntil;
      this.displayDates.until = this.formatDate(this.storageUntil);
    } else {
      this.queryOptions.until = endOfDay(new Date()).toISOString();
      this.displayDates.until = this.formatDate(this.queryOptions.until);
    }

    this.datepicker.cancelText = this.translate.instant('funds.fund_operations.cancel_datepicker_text');
    this.datepicker.doneText = this.translate.instant('funds.fund_operations.done_datepicker_text');
  }

  getOperationsHistory(options: any = null, hasInfiniteScroll?: boolean) {
    this.apiFunds.getOperationsHistory(this.fundName, options).subscribe((data) => {
      this.paginationOptions.cursor = (data.cursors && data.cursors.next) || '';
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
    this.queryOptions[type] = event.detail.value;
    this.getOperationsHistory(this.getQueryParams());
    this.get_max_date_for_selection();
  }

  date_to_utc(date) {
    return moment(date).utc().format();
  }

  get_max_date_for_selection() {
    this.maxDate = moment().utc().format();
  }

  viewOrderDetail(id) {
    const order = this.orders.find((x) => x.id === id);
    this.navController.navigateForward(['funds/fund-operations-detail', order.id]);
  }

  async setDatesInStorage() {
    if (this.queryOptions.since) {
      await this.loadingService.show();
      this.storageSince = this.queryOptions.since;
      await this.storage.set(CONFIG.operationHistoryDates.since, this.queryOptions.since).then(() => {
        this.loadingService.dismiss();
      });
    }

    if (this.queryOptions.until) {
      await this.loadingService.show();
      this.storageUntil = this.queryOptions.until;
      await this.storage.set(CONFIG.operationHistoryDates.until, this.queryOptions.until).then(() => {
        this.loadingService.dismiss();
      });
    }
  }

  ngOnInit() {}

  async ionViewWillLeave() {
    await this.setDatesInStorage();
  }
}
