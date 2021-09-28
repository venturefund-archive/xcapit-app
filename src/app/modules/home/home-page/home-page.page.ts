import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NavController } from '@ionic/angular';
import { ApiWebflowService } from 'src/app/shared/services/api-webflow/api-webflow.service';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;
@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
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
      <div class="toolbar_extend"></div>
      <div class="overlap_buttons">
        <app-home-subheader></app-home-subheader>
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
      <!-- Content Cards -->
      <div class="ion-padding">
        <div class="wmw" appTrackClick name="Go to Wallet" (click)="this.goToWallet()">
          <div class="wmw__image">
            <ion-img src="../assets/img/home/want_my_wallet.svg" alt="Girl with coins"></ion-img>
          </div>
          <div class="wmw__content">
            <div class="wmw__content__title">
              <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-16">{{
                'home.home_page.want_my_wallet.title' | translate
              }}</ion-text>
            </div>
            <div class="wmw__content__description">
              <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-12">{{
                'home.home_page.want_my_wallet.description' | translate
              }}</ion-text>
            </div>
          </div>
          <div class="wmw__arrow">
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
        </div>

        <div class="two_cards">
          <div
            class="strategies vertical-card"
            appTrackClick
            name="Go to Strategies Cards"
            (click)="this.goToStrategies()"
          >
            <div class="strategies__image">
              <ion-img src="../assets/img/home/girl_with_screen.svg"></ion-img>
            </div>
            <div class="strategies__content">
              <div class="strategies__content__title">
                <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-16">{{
                  'home.home_page.strategies.title' | translate
                }}</ion-text>
              </div>
              <div class="strategies__content__description">
                <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-10">{{
                  'home.home_page.strategies.description' | translate
                }}</ion-text>
              </div>
            </div>
            <div class="link">
              <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-14">{{
                'home.home_page.strategies.link_text' | translate
              }}</ion-text>
            </div>
          </div>
          <div class="support vertical-card" appTrackClick name="Go to Support Page" (click)="this.goToSupportPage()">
            <div class="support__image">
              <ion-img src="../assets/img/home/high_five.svg"></ion-img>
            </div>
            <div class="support__content">
              <div class="support__content__title">
                <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-16">{{
                  'home.home_page.support.title' | translate
                }}</ion-text>
              </div>
              <div class="support__content__description">
                <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-10">{{
                  'home.home_page.support.description' | translate
                }}</ion-text>
              </div>
            </div>
            <div class="link">
              <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-14">{{
                'home.home_page.support.link_text' | translate
              }}</ion-text>
            </div>
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
  styleUrls: ['./home-page.page.scss'],
})
export class HomePage implements OnInit {
  news: Array<any>;
  hasNotifications = false;
  lockActivated = false;
  hideFundText: boolean;

  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;

  private notificationQtySubscription: Subscription;
  private notificationQtySubject = new Subject();
  private timerSubscription: Subscription;
  public unreadNotifications: number;

  constructor(
    private navController: NavController,
    private apiWebFlow: ApiWebflowService,
    private notificationsService: NotificationsService,
    private refreshTimeoutService: RefreshTimeoutService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.initQtyNotifications();
    this.createNotificationTimer();
    this.getNews();
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
  createNotificationTimer() {
    this.timerSubscription = timer(0, 0.5 * 60000).subscribe(() => {
      this.notificationQtySubject.next();
    });
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

  showNotifications() {
    this.navController.navigateForward('/notifications/list');
    this.unreadNotifications = 0;
  }

  async doRefresh(event) {
    if (this.refreshTimeoutService.isAvailable()) {
      await this.getNews();
      this.refreshTimeoutService.lock();
      event.target.complete();
    } else {
      setTimeout(() => event.target.complete(), 1000);
    }
  }

  getNews() {
    this.apiWebFlow.getNews().subscribe((res) => {
      this.news = res;
    });
  }

  async goToWallet() {
    this.navController.navigateForward('/tabs/wallets');
  }

  goToSupportPage() {
    this.navController.navigateForward('/tickets/create-support-ticket');
  }

  goToStrategies() {
    this.navController.navigateForward('/funds/fund-investment/show');
  }
}
