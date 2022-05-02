import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NavController } from '@ionic/angular';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { QuotesCardComponent } from '../shared-home/components/quotes-card/quotes-card.component';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { WalletBalanceService } from '../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { BalanceCacheService } from '../../wallets/shared-wallets/services/balance-cache/balance-cache.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { NullPrices } from '../../wallets/shared-wallets/models/prices/null-prices/null-prices';
import { NullBalances } from '../../wallets/shared-wallets/models/balances/null-balances/null-balances';
import { ZeroBalance } from '../../wallets/shared-wallets/models/balance/zero-balance/zero-balance';
import { TotalBalance } from '../../wallets/shared-wallets/models/balance/total-balance/total-balance';
import { TokenDetail } from '../../wallets/shared-wallets/models/token-detail/token-detail';
import { CovalentBalancesController } from '../../wallets/shared-wallets/models/balances/covalent-balances/covalent-balances.controller';
import { TokenPricesController } from '../../wallets/shared-wallets/models/prices/token-prices/token-prices.controller';
import { TokenDetailController } from '../../wallets/shared-wallets/models/token-detail/token-detail.controller';
import { TotalBalanceController } from '../../wallets/shared-wallets/models/balance/total-balance/total-balance.controller';
import { HttpClient } from '@angular/common/http';

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
  hasWallet: boolean;
  coins: Coin[];
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;
  notificationInterval = 30000;
  totalBalanceModel: TotalBalance;
  userTokens: Coin[];
  tokenDetails: TokenDetail[] = [];
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
    private http: HttpClient,
    private covalentBalances: CovalentBalancesController,
    private tokenPrices: TokenPricesController,
    private tokenDetail: TokenDetailController,
    private totalBalance: TotalBalanceController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.initQtyNotifications();
    this.createNotificationTimer();
  }

  async ionViewDidEnter() {
    await this.checkWalletExist();
    await this.setUserTokens();
    await this.initialize();
  }

  async initialize() {
    this.initializeTotalBalance();
    if (this.hasWallet) {
      await this.loadCachedTotalBalance();
      await this.setTokenDetails();
      await this.fetchDetails();
      await this.fetchTotalBalance();
      await this.updateCachedTotalBalance();
    }
  }

  private async checkWalletExist(): Promise<void> {
    this.hasWallet = await this.walletService.walletExist();
  }

  private async setUserTokens(): Promise<void> {
    this.userTokens = await this.storageService.getAssestsSelected();
  }

  private async loadCachedTotalBalance() {
    this.balance = await this.balanceCacheService.total();
  }

  private initializeTotalBalance() {
    this.totalBalanceModel = this.totalBalance.new(new NullPrices(), new NullBalances(), new ZeroBalance());
  }

  private async setTokenDetails() {
    const result = [];
    for (const network of this.apiWalletService.getNetworks()) {
      const tokens = this.userTokens.filter((token) => token.network === network);
      const address = await this.storageService.getWalletsAddresses(network);

      if (tokens.length) {
        const balances = this.covalentBalances.new(address, tokens, this.http);
        const prices = this.tokenPrices.new(tokens, this.http);
        for (const token of tokens) {
          const tokenDetail = this.tokenDetail.new(balances, prices, token, this.balanceCacheService);
          result.push(tokenDetail);
          await tokenDetail.cached();
        }
        this.totalBalanceModel = this.totalBalance.new(prices, balances, this.totalBalanceModel);
      }
    }
    this.tokenDetails = result;
  }

  private async fetchDetails() {
    for (const tokenDetail of this.tokenDetails) {
      await tokenDetail.fetch();
      await tokenDetail.cache();
    }
  }

  private async fetchTotalBalance() {
    this.balance = await this.totalBalanceModel.value();
  }

  private async updateCachedTotalBalance() {
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
    this.navController.navigateForward(['/fiat-ramps/select-provider']);
  }
}
