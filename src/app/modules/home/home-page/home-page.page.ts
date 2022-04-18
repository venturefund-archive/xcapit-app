import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NavController } from '@ionic/angular';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { QuotesCardComponent } from '../shared-home/components/quotes-card/quotes-card.component';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { WalletBalanceService } from '../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { BalanceCacheService } from '../../wallets/shared-wallets/services/balance-cache/balance-cache.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { QueueService } from '../../../shared/services/queue/queue.service';
import { AssetBalanceModel } from '../../wallets/shared-wallets/models/asset-balance/asset-balance.class';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
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
      <ion-refresher
        (ionRefresh)="this.refresh($event)"
        close-duration="1000ms"
        slot="fixed"
        pull-factor="0.6"
        pull-min="50"
        pull-max="60"
      >
        <ion-refresher-content class="refresher" refreshingSpinner="true" pullingIcon="false">
          <app-ux-loading-block *ngIf="this.isRefreshAvailable$ | async" minSize="34px"></app-ux-loading-block>
          <ion-text class="ux-font-text-xxs" color="neutral80" *ngIf="(this.isRefreshAvailable$ | async) === false">
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
            [walletExist]="this.hasWallet"
            [totalBalanceWallet]="this.balance"
          ></app-wallet-total-balance-card>
        </div>
        <div *appFeatureFlag="'ff_buyCriptoHomeCard'" class="buy-crypto-card">
          <app-buy-crypto-card name="Buy Cripto Card" (clicked)="this.goToBuyCrypto()"></app-buy-crypto-card>
        </div>
        <div class="wallet-connect-card">
          <app-wallet-connect-card></app-wallet-connect-card>
        </div>
        <div class="quotes-card">
          <app-quotes-card></app-quotes-card>
        </div>
        <div class="investor-test-card">
          <app-investor-test-cards></app-investor-test-cards>
        </div>
        <div class="financial-planner-card">
            <app-financial-planner-card></app-financial-planner-card>
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
  @ViewChild(QuotesCardComponent) quotesCardComponent: QuotesCardComponent;
  hasNotifications = false;
  lockActivated = false;
  hideFundText: boolean;
  balance: number;
  accumulatedBalance = 0;
  hasWallet: boolean;
  coins: Coin[];
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;
  leave$ = new Subject<void>();
  requestQuantity = 0;
  notificationInterval = 30000;
  private notificationQtySubscription: Subscription;
  private notificationQtySubject = new Subject();
  private timerSubscription: Subscription;
  public unreadNotifications: number;

  constructor(
    private navController: NavController,
    private notificationsService: NotificationsService,
    private refreshTimeoutService: RefreshTimeoutService,
    private walletService: WalletService,
    private walletBalance: WalletBalanceService,
    private apiWalletService: ApiWalletService,
    private balanceCacheService: BalanceCacheService,
    private storageService: StorageService,
    private queueService: QueueService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.initQtyNotifications();
    this.createNotificationTimer();
  }

  async ionViewDidEnter() {
    await this.initialize();
  }

  async initialize() {
    this.queueService.dequeueAll();
    this.requestQuantity = 0;
    this.accumulatedBalance = 0;
    this.hasWallet = await this.walletService.walletExist();
    await this.totalBalance();
  }

  private async totalBalance() {
    if (this.hasWallet) {
      this.balance = await this.balanceCacheService.total();
      this.coins = await this.storageService.getAssestsSelected();
      this.createQueues();
      await this.enqueueCoins();
    }
  }

  private createQueues(): void {
    for (const network of this.apiWalletService.getNetworks()) {
      this.queueService.create(network, 2);
      this.queueService.results(network).pipe(takeUntil(this.leave$)).subscribe();
    }
    this.queueService.create('prices', 2);
    this.queueService.results('prices').pipe(takeUntil(this.leave$)).subscribe();
  }

  private async enqueueCoins(): Promise<void> {
    for (const aCoin of this.coins) {
      const assetBalance = new AssetBalanceModel(aCoin, this.walletBalance, this.balanceCacheService);
      this.enqueue(assetBalance);
      await this.accumulateBalance(assetBalance);
    }
  }

  private enqueue(assetBalance: AssetBalanceModel): void {
    this.queueService.enqueue(assetBalance.coin.network, () => assetBalance.balance());
    this.queueService.enqueue('prices', () => assetBalance.getPrice());
  }

  private accumulateBalance(assetBalance: AssetBalanceModel): void {
    assetBalance.quoteBalance.pipe(takeUntil(this.leave$)).subscribe(async (quote: number) => {
      this.accumulatedBalance += quote;
      this.requestQuantity++;
      if (this.accumulationEnded()) await this.updateBalance();
    });
  }

  private accumulationEnded() {
    return this.requestQuantity === this.coins.length;
  }

  private async updateBalance() {
    this.balance = this.accumulatedBalance;
    await this.balanceCacheService.updateTotal(this.balance);
  }

  ionViewDidLeave() {
    if (this.timerSubscription && !this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
    }

    if (this.notificationQtySubscription && !this.notificationQtySubscription.closed) {
      this.notificationQtySubscription.unsubscribe();
    }

    this.refreshTimeoutService.unsubscribe();
    this.leave$.complete();
  }

  createNotificationTimer() {
    this.timerSubscription = timer(0, this.notificationInterval).subscribe(() => {
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

  async refresh(event: any): Promise<void> {
    if (this.refreshTimeoutService.isAvailable()) {
      await this.initialize();
      this.refreshTimeoutService.lock();
      this.quotesCardComponent.ngOnInit();
    }
    setTimeout(() => event.target.complete(), 1000);
  }

  goToBuyCrypto() {
    this.navController.navigateForward(['/fiat-ramps/moonpay']);
  }
}
