import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NavController } from '@ionic/angular';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';

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
          <app-xcapit-logo [whiteLogo]="true"></app-xcapit-logo>
        </div>
        <app-avatar-profile></app-avatar-profile>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher (ionRefresh)="doRefresh($event)" slot="fixed" pull-factor="0.6" pull-min="50" pull-max="60">
        <ion-refresher-content class="refresher" close-duration="120ms" refreshingSpinner="false" pullingIcon="false">
          <app-ux-loading-block *ngIf="this.isRefreshAvailable$ | async" minSize="34px"></app-ux-loading-block>
          <ion-text class="ux-font-text-xxs" color="uxsemidark" *ngIf="(this.isRefreshAvailable$ | async) === false">
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
        <app-wallet-balance-card-home></app-wallet-balance-card-home>

        <div class="buy-crypto-card">
          <app-buy-crypto-card (clicked)="this.goToBuyCrypto()"></app-buy-crypto-card>
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
                <ion-text class="ux-font-header-titulo">{{ 'home.home_page.strategies.title' | translate }}</ion-text>
              </div>
              <div class="strategies__content__description">
                <ion-text class="ux-font-text-xxs regular">{{
                  'home.home_page.strategies.description' | translate
                }}</ion-text>
              </div>
            </div>
            <div class="link">
              <ion-text class="ux-font-text-xs semibold">{{
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
                <ion-text class="ux-font-header-titulo">{{ 'home.home_page.support.title' | translate }}</ion-text>
              </div>
              <div class="support__content__description">
                <ion-text class="ux-font-text-xxs regular">{{
                  'home.home_page.support.description' | translate
                }}</ion-text>
              </div>
            </div>
            <div class="link">
              <ion-text class="ux-font-text-xs semibold">{{ 'home.home_page.support.link_text' | translate }}</ion-text>
            </div>
          </div>
        </div>
        <app-quotes-card></app-quotes-card>
        <app-need-help-card></app-need-help-card>
        <app-investor-test-cards></app-investor-test-cards>
      </div>
    </ion-content>
  `,
  styleUrls: ['./home-page.page.scss'],
})
export class HomePage implements OnInit {
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
    private notificationsService: NotificationsService,
    private refreshTimeoutService: RefreshTimeoutService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.initQtyNotifications();
    this.createNotificationTimer();
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
      this.refreshTimeoutService.lock();
      event.target.complete();
    } else {
      setTimeout(() => event.target.complete(), 1000);
    }
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

  goToBuyCrypto() {
    this.navController.navigateForward('/fiat-ramps/operations');
  }
}
