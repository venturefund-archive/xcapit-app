import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { BalanceCacheService } from '../shared-wallets/services/balance-cache/balance-cache.service';
import { HttpClient } from '@angular/common/http';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';
import { TotalBalance } from '../shared-wallets/models/balance/total-balance/total-balance';
import { ZeroBalance } from '../shared-wallets/models/balance/zero-balance/zero-balance';
import { NullPrices } from '../shared-wallets/models/prices/null-prices/null-prices';
import { NullBalances } from '../shared-wallets/models/balances/null-balances/null-balances';
import { CovalentBalancesController } from '../shared-wallets/models/balances/covalent-balances/covalent-balances.controller';
import { TokenPricesController } from '../shared-wallets/models/prices/token-prices/token-prices.controller';
import { TokenDetailController } from '../shared-wallets/models/token-detail/token-detail.controller';
import { TotalBalanceController } from '../shared-wallets/models/balance/total-balance/total-balance.controller';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { GraphqlService } from '../shared-wallets/services/graphql/graphql.service';
import { AvailableDefiProducts } from '../../defi-investments/shared-defi-investments/models/available-defi-products/available-defi-products.model';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { DefiProduct } from '../../defi-investments/shared-defi-investments/interfaces/defi-product.interface';
import { TwoPiProduct } from '../../defi-investments/shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { TwoPiProductFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-product/factory/two-pi-product.factory';
import { TwoPiApi } from '../../defi-investments/shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { Cipher } from 'crypto';

@Component({
  selector: 'app-home-wallet',
  template: ` <ion-header>
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
      <div class="wt__subheader__value">
        <div class="title ux-font-num-subtitulo">
          <ion-text>
            {{ 'wallets.home.available_money' | translate }}
          </ion-text>
        </div>
        <div class="wt__spinner-and-amount ux-font-num-titulo">
          <ion-spinner
            color="white"
            name="crescent"
            *ngIf="this.balance === undefined && this.walletExist"
          ></ion-spinner>
          <div class="wt__amount-and-eye">
            <div class="wt__amount-and-eye__amount">
              <ion-text *ngIf="this.balance !== undefined || !this.walletExist">
                {{ this.balance ?? 0.0 | number: '1.2-2' | hideText: this.hideFundText }}
              </ion-text>
              <ion-text class="ux-font-text-lg" *ngIf="this.balance !== undefined || !this.walletExist">USD</ion-text>
            </div>
            <div class="wt__amount-and-eye__eye">
              <app-eye></app-eye>
            </div>
          </div>
        </div>
        <div class="wt__total-invested" color="success">
          <ion-spinner
            class="wt__total-invested__spinner"
            *ngIf="!this.spinnerActivated"
            color="white"
            name="crescent"
          ></ion-spinner>
          <ion-text
            *ngIf="this.balance !== undefined && this.spinnerActivated && this.walletExist"
            class="wt__total-invested__text ux-font-title-xs"
            >{{ 'wallets.home.invested' | translate }}
            {{ this.totalInvested ?? 0.0 | number: '1.2-2' | hideText: this.hideFundText }} USD</ion-text
          >
        </div>
      </div>
      <div class="wt__subheader" *ngIf="!this.walletExist">
        <app-wallets-subheader></app-wallets-subheader>
      </div>
      <div class="wt__overlap_buttons" *ngIf="this.walletExist">
        <app-wallet-subheader-buttons></app-wallet-subheader-buttons>
      </div>
      <div class="wt__backup" *ngIf="this.walletExist && !this.protectedWallet">
        <app-backup-information-card
          [text]="'wallets.home.backup_card_component.text'"
          [textClass]="'ux-home-backup-card'"
          (cardClicked)="this.goToBackup()"
        >
        </app-backup-information-card>
      </div>

      <div class="wt" *ngIf="this.walletExist">
        <div class="wt__segments">
          <form [formGroup]="this.segmentsForm">
            <ion-segment mode="ios" class="ux-segment-modern" formControlName="tab">
              <ion-segment-button value="assets" name="ux_tab_tokens" appTrackClick>
                <ion-label
                  [ngClass]="{ 'active-tab': this.segmentsForm.value.tab === 'assets' }"
                  class="ux-font-text-lg"
                  >{{ 'wallets.home.tab_assets' | translate }}</ion-label
                >
              </ion-segment-button>
              <ion-segment-button value="nft" name="ux_tab_nfts" appTrackClick>
                <ion-label
                  [ngClass]="{ 'active-tab': this.segmentsForm.value.tab === 'nft' }"
                  class="ux-font-text-lg"
                  >{{ 'wallets.home.tab_nfts' | translate }}</ion-label
                >
              </ion-segment-button>
            </ion-segment>
          </form>
        </div>
        <div class="wt__nfts" *ngIf="this.segmentsForm.value.tab === 'nft'">
          <div class="wt__nfts__content segment-content last-selected">
            <app-nft-card *ngIf="this.walletExist"></app-nft-card>
          </div>
        </div>
        <div class="wt__balance" *ngIf="this.walletExist && this.segmentsForm.value.tab === 'assets'">
          <div class="wt__balance segment-content first-selected">
            <div class="wt__balance__button ion-padding-end">
              <ion-button
                appTrackClick
                name="Edit Tokens"
                class="ion-no-margin"
                fill="clear"
                size="small"
                (click)="this.goToSelectCoins()"
              >
                <ion-icon icon="ux-adjustments"></ion-icon>
              </ion-button>
            </div>
            <ion-spinner
              class="wt__balance__loading"
              color="primary"
              name="crescent"
              *ngIf="this.tokenDetails.length === 0"
            ></ion-spinner>
            <app-wallet-balance-card-item
              *ngFor="let tokenDetail of this.tokenDetails; let last = last"
              [tokenDetail]="tokenDetail"
              [last]="last"
            ></app-wallet-balance-card-item>
          </div>
        </div>
      </div>
      <div class="wt__start-investing" *ngIf="this.walletExist">
        <app-start-investing></app-start-investing>
      </div>
      <div class="wt__button" *ngIf="!this.walletExist">
        <ion-button
          (click)="this.goToRecoveryWallet()"
          class="ux-link-xs"
          appTrackClick
          name="ux_import_import_wallet"
          type="button"
          fill="clear"
        >
          {{ 'wallets.home.wallet_recovery' | translate }}
        </ion-button>
      </div>
    </ion-content>`,
  styleUrls: ['./home-wallet.page.scss'],
})
export class HomeWalletPage implements OnInit {
  walletExist: boolean;
  hideFundText: boolean;
  protectedWallet: boolean;
  tokenDetails: TokenDetail[] = [];
  userTokens: Coin[];
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  segmentsForm: UntypedFormGroup = this.formBuilder.group({
    tab: ['assets', [Validators.required]],
  });
  totalBalanceModel: TotalBalance;
  balance: number;
  address: string;
  defiProducts: DefiProduct[];
  totalInvested: number;
  spinnerActivated: boolean;
  pids = [];

  constructor(
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private formBuilder: UntypedFormBuilder,
    private refreshTimeoutService: RefreshTimeoutService,
    private storageService: StorageService,
    private balanceCacheService: BalanceCacheService,
    private http: HttpClient,
    private covalentBalances: CovalentBalancesController,
    private tokenPrices: TokenPricesController,
    private tokenDetail: TokenDetailController,
    private totalBalance: TotalBalanceController,
    private trackService: TrackService,
    private ionicStorageService: IonicStorageService,
    private localStorageService: LocalStorageService,
    private remoteConfig: RemoteConfigService,
    private graphql: GraphqlService,
    private twoPiProductFactory: TwoPiProductFactory,
    private twoPiApi: TwoPiApi
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.subscribeOnHideFunds();
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_screenview_wallet',
    });
    this, this.getUserWalletAddress();
    this.isProtectedWallet();
  }

  async ionViewDidEnter() {
    await this.checkWalletExist();
    await this.initialize();
  }

  private getAvailableDefiProducts(): void {
    this.defiProducts = this.createAvailableDefiProducts().value();
  }

  createAvailableDefiProducts(): AvailableDefiProducts {
    return new AvailableDefiProducts(this.remoteConfig);
  }

  async getInvestments() {
    this.pids = [];
    for (const product of this.defiProducts) {
      const anInvestmentProduct = await this.getInvestmentProduct(product);
      this.pids.push(anInvestmentProduct.id());
    }
    this.calculatedTotalBalanceInvested();
  }

  async getInvestmentProduct(product: DefiProduct): Promise<TwoPiProduct> {
    return this.twoPiProductFactory.create(await this.twoPiApi.vault(product.id));
  }

  calculatedTotalBalanceInvested() {
    this.totalInvested = 0;
    for (let pid of this.pids) {
      this.graphql.getInvestedBalance(this.address, pid).subscribe(({ data }) => {
        if (data.flows[0]) {
          let balance = parseFloat(data.flows[0].balanceUSD);
          this.totalInvested += balance;
        }
      });
    }
    this.spinnerActivated = true;
  }

  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    if (wallet) this.address = wallet.addresses.MATIC;
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  async initialize(): Promise<void> {
    await this.content.scrollToTop(0);
    if (this.walletExist) {
      await this.loadCachedTotalBalance();
      await this.setUserTokens();
      this.initializeTotalBalance();
      await this.setTokenDetails();
      await this.fetchDetails();
      await this.fetchTotalBalance();
      await this.updateCachedTotalBalance();
      this.getAvailableDefiProducts();
      await this.getInvestments();
    }
  }

  goToBackup() {
    this.navController.navigateForward('/wallets/recovery/read');
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
    this.sortTokens(result);
    this.tokenDetails = result;
    this.spinnerActivated = false;
  }

  private async fetchDetails() {
    for (const tokenDetail of this.tokenDetails) {
      await tokenDetail.fetch();
      await tokenDetail.cache();
    }
    this.sortTokens(this.tokenDetails);
  }

  private async fetchTotalBalance() {
    this.balance = await this.totalBalanceModel.value();
  }

  private sortTokens(tokenDetails: TokenDetail[]) {
    tokenDetails.sort((a, b) => b.balance * b.price - a.balance * a.price);
  }

  private async loadCachedTotalBalance() {
    this.balance = await this.balanceCacheService.total();
  }

  private async updateCachedTotalBalance() {
    await this.balanceCacheService.updateTotal(this.balance);
  }

  async refresh(event: any): Promise<void> {
    if (this.refreshTimeoutService.isAvailable()) {
      await this.initialize();
      this.refreshTimeoutService.lock();
    }
    setTimeout(() => event.target.complete(), 1000);
  }

  private async checkWalletExist(): Promise<void> {
    this.walletExist = await this.walletService.walletExist();
  }

  private async setUserTokens(): Promise<void> {
    this.userTokens = await this.storageService.getAssestsSelected();
  }

  async isProtectedWallet() {
    this.protectedWallet = await this.ionicStorageService.get('protectedWallet');
  }

  goToRecoveryWallet(): void {
    this.navController.navigateForward(['wallets/create-first/disclaimer', 'import']);
  }

  goToSelectCoins(): void {
    this.navController.navigateForward(['wallets/select-coins', 'edit']);
  }
}
