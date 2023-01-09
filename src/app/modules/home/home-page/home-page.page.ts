import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { QuotesCardComponent } from '../shared-home/components/quotes-card/quotes-card.component';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
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
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletBackupService } from '../../wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { BlockchainTokens } from '../../swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { DefaultTokens } from '../../swaps/shared-swaps/models/tokens/tokens';
import { TokenRepo } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WalletsFactory } from '../../swaps/shared-swaps/models/wallets/factory/wallets.factory';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
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
              'app.main_menu.pull_to_refresh'
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
        <div *appBuyCryptoFeatureFlag>
          <div *ngIf="this.hasWallet">
            <app-buy-crypto-card name="Buy Cripto Card" (clicked)="this.goToBuyCrypto()"></app-buy-crypto-card>
          </div>
        </div>
        <div class="wallet-connect-card">
          <app-wallet-connect-card></app-wallet-connect-card>
        </div>
        <div class="quotes-card">
          <app-quotes-card></app-quotes-card>
        </div>
        <div *ngIf="this.hasWallet" class="donations-card">
          <app-donations-card></app-donations-card>
        </div>
        <div class="investor-test-card">
          <app-investor-test-cards></app-investor-test-cards>
        </div>
        <div class="financial-planner-card">
          <app-financial-planner-card *ngIf="!this.data"></app-financial-planner-card>
          <div class="ux-card" *ngIf="this.data">
            <div class="ion-padding title">
              <ion-text class="ux-font-text-lg">{{
                'home.shared.financial_planner_card.my_plan' | translate
              }}</ion-text>
            </div>
            <div class="card-objetive ion-padding" (click)="this.goToPlannerInfo()">
              <app-objetive-card
                *ngIf="this.data"
                [icon]="this.icon"
                [category]="this.category"
                [necessaryAmount]="this.necessaryAmount"
                [name]="this.name"
                [edit]="false"
              ></app-objetive-card>
            </div>
          </div>
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
  lockActivated = false;
  hideFundText: boolean;
  balance: number;
  hasWallet: boolean;
  coins: Coin[];
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;
  totalBalanceModel: TotalBalance;
  userTokens: Coin[];
  tokenDetails: TokenDetail[] = [];
  data: any;
  icon: string;
  category: string;
  name: string;
  necessaryAmount: number;

  constructor(
    private navController: NavController,
    private refreshTimeoutService: RefreshTimeoutService,
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private balanceCacheService: BalanceCacheService,
    private storageService: StorageService,
    private http: HttpClient,
    private covalentBalances: CovalentBalancesController,
    private tokenPrices: TokenPricesController,
    private tokenDetail: TokenDetailController,
    private totalBalance: TotalBalanceController,
    private appStorage: AppStorageService,
    private walletBackupService: WalletBackupService,
    private storage: IonicStorageService,
    private trackService: TrackService,
    private blockchainsFactory: BlockchainsFactory,
    private walletsFactory: WalletsFactory
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getPlannerData();
    this.trackScreenViewEvent();
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

  async getPlannerData() {
    this.data = await this.appStorage.get('planner_data');
    this.setData();
  }

  setData() {
    if (this.data) {
      this.name = this.data.name;
      this.necessaryAmount = this.data.necessaryAmount;
      this.icon = `assets/img/financial-planner/categories/${this.data.category}.svg`;
      this.category = `financial_planner.shared_financial_planner.objetive_card.categories.${this.data.category}`;
    }
  }

  private async checkWalletExist(): Promise<void> {
    this.hasWallet = await this.walletService.walletExist();
  }

  private async setUserTokens(): Promise<void> {
    this.userTokens = await this.storageService.getAssetsSelected();
  }

  private async loadCachedTotalBalance() {
    this.balance = await this.balanceCacheService.total();
  }

  private initializeTotalBalance() {
    this.totalBalanceModel = this.totalBalance.new(new NullPrices(), new NullBalances(), new ZeroBalance());
  }

  private async setTokenDetails() {
    const tokenDetails : TokenDetail[] = [];

    for (const blockchain of this.blockchainsFactory.create().value()) {
      const tokens: any = new BlockchainTokens(blockchain, new DefaultTokens(new TokenRepo(this.userTokens)));
      if ((await tokens.value()).length) {
        const balances = this.covalentBalances.new(
          (await this.walletsFactory.create().oneBy(blockchain)).address(),
          tokens,
          this.http
        );
        const prices = this.tokenPrices.new(tokens, this.http);
        for (const token of await tokens.value()) {
          const tokenDetail = this.tokenDetail.new(balances, prices, token, this.balanceCacheService);
          tokenDetails.push(tokenDetail);
          await tokenDetail.cached();
        }
        this.totalBalanceModel = this.totalBalance.new(prices, balances, this.totalBalanceModel);
      }
    }
    this.tokenDetails = tokenDetails;
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
    this.refreshTimeoutService.unsubscribe();
  }

  async refresh(event: any): Promise<void> {
    if (this.refreshTimeoutService.isAvailable()) {
      await this.initialize();
      this.refreshTimeoutService.lock();
      this.quotesCardComponent.ngOnInit();
    }
    setTimeout(() => event.target.complete(), 1000);
  }

  async goToBuyCrypto() {
    if ((await this.walletBackupService.presentModal()) === 'skip') {
      const conditionsPurchasesAccepted = await this.storage.get('conditionsPurchasesAccepted');
      const url = !conditionsPurchasesAccepted ? 'fiat-ramps/buy-conditions' : 'fiat-ramps/token-selection';
      this.navController.navigateForward([url]);
    }
  }

  goToPlannerInfo() {
    this.navController.navigateForward(['/financial-planner/result-objetive']);
  }

  trackScreenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_screenview_home',
    });
  }
}
