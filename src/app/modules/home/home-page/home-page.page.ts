import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NavController } from '@ionic/angular';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { WalletBalanceService } from '../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { AssetBalance } from '../../wallets/shared-wallets/interfaces/asset-balance.interface';

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
        <div class="wallet-total-balance-card">
          <app-wallet-total-balance-card
            [walletExist]="this.walletExist"
            [totalBalanceWallet]="this.totalBalanceWallet"
          ></app-wallet-total-balance-card>
        </div>
        <div class="buy-crypto-card">
          <app-buy-crypto-card (clicked)="this.goToBuyCrypto()"></app-buy-crypto-card>
        </div>
        <div class="investor-test-card">
          <app-investor-test-cards></app-investor-test-cards>
        </div>
        <div class="need-help-card">
          <app-need-help-card></app-need-help-card>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./home-page.page.scss'],
})
export class HomePage implements OnInit {
  hasNotifications = false;
  lockActivated = false;
  hideFundText: boolean;
  totalBalanceWallet: number;
  balances: Array<AssetBalance> = [];
  walletExist: boolean;
  alreadyInitialized = false;
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;

  private notificationQtySubscription: Subscription;
  private notificationQtySubject = new Subject();
  private timerSubscription: Subscription;
  public unreadNotifications: number;

  constructor(
    private navController: NavController,
    private notificationsService: NotificationsService,
    private refreshTimeoutService: RefreshTimeoutService,
    private walletService: WalletService,
    private walletBalance: WalletBalanceService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.initQtyNotifications();
    this.createNotificationTimer();
    this.existWallet();
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
      this.uninitializedWallet();
      await this.getCoinsBalance();
      this.refreshTimeoutService.lock();
      event.target.complete();
    } else {
      setTimeout(() => event.target.complete(), 1000);
    }
  }

  goToBuyCrypto() {
    this.navController.navigateForward('/fiat-ramps/operations');
  }

  existWallet() {
    this.walletService.walletExist().then((res) => {
      this.walletExist = res;
      if (this.walletExist && !this.alreadyInitialized) {
        this.alreadyInitialized = true;
        this.getCoinsBalance();
      }
    });
  }

  getCoinsBalance() {
    this.walletBalance.getWalletsBalances().then((res) => {
      this.balances = res;
      this.getTotalBalance();
      this.uninitializedWallet();
    });
  }

  getTotalBalance() {
    this.walletBalance.getUsdTotalBalance().then((res) => {
      this.totalBalanceWallet = res;
    });
  }

  private uninitializedWallet() {
    this.alreadyInitialized = false;
  }
}
