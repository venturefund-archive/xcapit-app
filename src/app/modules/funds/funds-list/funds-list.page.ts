import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NavController } from '@ionic/angular';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-funds-list',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-button appTrackClick name="Go To Profile" (click)="this.goToProfile()">
            <ion-avatar class="avatar">
              <img src="assets/img/user-profile/avatar-default.png" />
            </ion-avatar>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end" *ngIf="true">
          <ion-button appTrackClick name="Show Notifications" (click)="this.showNotifications()">
            <ion-icon slot="icon-only" name="ux-bell"></ion-icon>
            <div class="notificationQty" *ngIf="this.unreadNotifications > 0">
              {{ this.unreadNotifications }}
            </div>
          </ion-button>
        </ion-buttons>
        <div class="header">
          <div class="header__logo ion-text-center">
            <app-xcapit-logo></app-xcapit-logo>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-ux-loading-block *ngIf="this.status?.status_name === ''" minSize="50px"></app-ux-loading-block>

      <app-fund-list-sub-header
        *ngIf="this.ownerFundBalances?.length && this.status?.status_name === 'COMPLETE'"
      ></app-fund-list-sub-header>
      <div
        class="fl__user-status__subheader"
        *ngIf="this.status?.status_name !== '' && this.status?.status_name !== 'COMPLETE'"
      ></div>
      <div
        [ngClass]="{ 'fl__user-status': this.status?.status_name !== 'COMPLETE' }"
        *ngIf="this.status?.status_name !== ''"
      >
        <app-user-status-card [userStatus]="this.status"></app-user-status-card>
      </div>
      <ion-refresher (ionRefresh)="doRefresh($event)" slot="fixed" pull-factor="0.6" pull-min="50" pull-max="60">
        <ion-refresher-content class="refresher" close-duration="120ms" refreshingSpinner="false" pullingIcon="false">
          <app-ux-loading-block *ngIf="this.isRefreshAvailable$ | async" minSize="34px"></app-ux-loading-block>
          <ion-text
            class="ux-font-lato ux-fweight-regular ux-fsize-10"
            color="uxsemidark"
            *ngIf="!(this.isRefreshAvailable$ | async)"
          >
            {{
              'funds.funds_list.refresh_time'
                | translate
                  : {
                      seconds: (this.refreshRemainingTime$ | async)
                    }
            }}
          </ion-text>
        </ion-refresher-content>
      </ion-refresher>

      <!-- Fund lists -->
      <div class="fl" *ngIf="this.status?.status_name === 'COMPLETE'">
        <div *ngIf="this.ownerFundBalances?.length" class="fl__funds ion-padding">
          <div class="fl__funds__title ux-font-lato ux-fweight-semibold ux-fsize-12">
            {{ 'funds.funds_list.funds_title' | translate }}
          </div>

          <app-ux-loading-block minSize="50px" *ngIf="!this.ownerFundBalances"></app-ux-loading-block>

          <div class="fl__funds__card" *ngFor="let fb of ownerFundBalances">
            <app-fund-card [fund]="fb" *ngIf="fb.state === 'active'"></app-fund-card>
          </div>
          <div class="fl__funds__card" *ngFor="let fb of ownerFundBalances">
            <app-fund-card
              [hideFundText]="this.hideFundText"
              [fund]="fb"
              *ngIf="fb.state === 'finalizado'"
            ></app-fund-card>
          </div>
        </div>
      </div>
      <div class="fl" *ngIf="this.notOwnerFundBalances?.length">
        <div class="fl__funds ion-padding">
          <div class="fl__funds__title ux-font-lato ux-fweight-semibold ux-fsize-12">
            {{ 'funds.funds_list.shared_funds_title' | translate }}
          </div>
          <app-ux-loading-block minSize="50px" *ngIf="!this.notOwnerFundBalances"></app-ux-loading-block>
          <div class="fl__funds__card" *ngFor="let nofb of notOwnerFundBalances">
            <app-fund-card [fund]="nofb"></app-fund-card>
          </div>
        </div>
      </div>

      <!-- Slider News -->
      <div class="academy ion-padding" *ngIf="this.news">
        <div class="academy__news__title ux-font-lato ux-fweight-semibold ux-fsize-12">
          <ion-label color="uxsemidark">{{ 'funds.funds_list.news_title' | translate }}</ion-label>
        </div>
        <app-slider-news [news]="this.news"></app-slider-news>
      </div>
    </ion-content>
  `,
  styleUrls: ['./funds-list.page.scss'],
})
export class FundsListPage implements OnInit {
  ownerFundBalances: Array<any>;
  notOwnerFundBalances: Array<any>;
  news: Array<any>;
  hasNotifications = false;
  lockActivated = false;
  hideFundText: boolean;

  status = {
    profile_valid: false,
    empty_linked_keys: false,
    has_own_funds: false,
    has_subscribed_funds: false,
    status_name: '',
  };

  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;

  private notificationQtySubscription: Subscription;
  private notificationQtySubject = new Subject();
  private timerSubscription: Subscription;
  public unreadNotifications: number;

  constructor(
    private apiFundsService: ApiFundsService,
    private apiUsers: ApiUsuariosService,
    private navController: NavController,
    private notificationsService: NotificationsService,
    private refreshTimeoutService: RefreshTimeoutService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {}

  createNotificationTimer() {
    this.timerSubscription = timer(0, 0.5 * 60000).subscribe(() => {
      this.notificationQtySubject.next();
    });
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  async hideText() {
    this.localStorageService.toggleHideFunds();
  }

  async ionViewWillEnter() {
    this.initQtyNotifications();
    this.createNotificationTimer();
    this.subscribeOnHideFunds();
    this.getStatus();
    await this.getOwnerFundBalances();
    await this.getNotOwnerFundBalances();
  }

  ionViewDidLeave() {
    if (this.timerSubscription && !this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
    }

    if (this.notificationQtySubscription && !this.notificationQtySubscription.closed) {
      this.notificationQtySubscription.unsubscribe();
    }

    this.refreshTimeoutService.unsubscribe();
  }

  initQtyNotifications() {
    this.notificationQtySubscription = this.notificationQtySubject
      .pipe(
        switchMap(() =>
          this.notificationsService.getCountNotifications().pipe(
            catchError((_) => {
              return EMPTY;
            })
          )
        )
      )
      .subscribe((res: any) => (this.unreadNotifications = res.count));
    this.notificationQtySubject.next();
  }

  getStatus() {
    this.apiUsers.status(false).subscribe((res) => {
      this.status = res;
    });
  }

  private async getOwnerFundBalances() {
    this.ownerFundBalances = await this.apiFundsService
      .getFundBalances(true, false)
      .pipe(map((res) => res.filter((fund) => fund.state !== 'pausado')))
      .toPromise();
  }

  private async getNotOwnerFundBalances() {
    this.notOwnerFundBalances = await this.apiFundsService.getFundBalances(false, false).toPromise();
  }

  showNotifications() {
    this.navController.navigateForward('notifications/list');
    this.unreadNotifications = 0;
  }

  goToProfile() {
    this.navController.navigateForward('profiles/user');
  }

  async doRefresh(event) {
    if (this.refreshTimeoutService.isAvailable()) {
      await this.getOwnerFundBalances();
      await this.getNotOwnerFundBalances();
      this.refreshTimeoutService.lock();
      event.target.complete();
    } else {
      setTimeout(() => event.target.complete(), 1000);
    }
  }
}
