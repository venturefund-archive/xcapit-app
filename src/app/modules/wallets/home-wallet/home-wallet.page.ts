import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NFTMetadata } from '../shared-wallets/interfaces/nft-metadata.interface';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { WalletBalanceService } from '../shared-wallets/services/wallet-balance/wallet-balance.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { BalanceCacheService, CachedCoin } from '../shared-wallets/services/balance-cache/balance-cache.service';
import { AssetBalanceClass } from '../shared-wallets/models/asset-balance/asset-balance.class';

@Component({
  selector: 'app-home-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <div class="header">
          <app-xcapit-logo [whiteLogo]="true"></app-xcapit-logo>
        </div>
        <app-avatar-profile></app-avatar-profile>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher (ionRefresh)="refresh($event)" slot="fixed" pull-factor="0.6" pull-min="50" pull-max="60">
        <ion-refresher-content class="refresher" close-duration="120ms" refreshingSpinner="true" pullingIcon="false">
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
      <div class="wt__subheader__value">
        <div class="wt__title ux-font-text-base">
          <ion-text>
            {{ 'wallets.home.available_money' | translate }}
          </ion-text>
        </div>
        <div class="wt__amount ux-font-num-titulo">
          <ion-text>
            {{ this.totalBalanceWallet | number: '1.2-2' }}
            USD
          </ion-text>
        </div>
      </div>
      <div class="wt__subheader" *ngIf="!this.walletExist">
        <app-wallets-subheader></app-wallets-subheader>
      </div>

      <div class="wt__overlap_buttons" *ngIf="this.walletExist">
        <app-wallet-subheader-buttons></app-wallet-subheader-buttons>
      </div>

      <div class="wt__segments ion-padding-start ion-padding-end" *ngIf="this.walletExist">
        <form [formGroup]="this.segmentsForm">
          <ion-segment mode="md" class="ux-segment" formControlName="tab">
            <ion-segment-button value="assets">
              <ion-label
                [ngClass]="{ 'active-tab': this.segmentsForm.value.tab === 'assets' }"
                class="ux-font-header-titulo"
                >{{ 'wallets.home.tab_assets' | translate }}</ion-label
              >
            </ion-segment-button>
            <ion-segment-button value="nft">
              <ion-label
                [ngClass]="{ 'active-tab': this.segmentsForm.value.tab === 'nft' }"
                class="ux-font-header-titulo"
                >{{ 'wallets.home.tab_nfts' | translate }}</ion-label
              >
            </ion-segment-button>
          </ion-segment>
        </form>
      </div>

      <div class="wt__nfts ion-padding-start ion-padding-end" *ngIf="this.segmentsForm.value.tab === 'nft'">
        <div class="wt__nfts__content segment-content last-selected">
          <app-nft-card
            [nftStatus]="this.nftStatus"
            (nftRequest)="this.createNFTRequest()"
            *ngIf="this.walletExist && this.nftStatus"
          >
          </app-nft-card>
        </div>
      </div>
      <div
        class="wt__balance ion-padding-start ion-padding-end"
        *ngIf="this.walletExist && this.segmentsForm.value.tab === 'assets'"
      >
        <div class="wt__balance__wallet-balance-card segment-content first-selected">
          <div class="wbc">
            <div class="wbc__button ion-padding-end">
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
            <app-wallet-balance-card-item
              *ngFor="let balance of this.balances; let last = last"
              [balance]="balance"
              [last]="last"
            ></app-wallet-balance-card-item>
          </div>
        </div>
        <ion-infinite-scroll threshold="200px" (ionInfinite)="this.loadMore()">
          <ion-infinite-scroll-content
            loadingSpinner="bubbles"
            loadingText="{{ 'funds.fund_operations.loading_infinite_scroll' | translate }}"
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
        <app-start-investing></app-start-investing>
      </div>
      <div class="wt__button" *ngIf="!this.walletExist">
        <ion-button
          (click)="this.goToRecoveryWallet()"
          class="ux-link-xs"
          appTrackClick
          name="Import Wallet"
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
  totalBalanceWallet = 0;
  balances: AssetBalanceClass[] = [];
  nftStatus = '';
  alreadyInitialized = false;
  selectedAssets: Coin[];
  NFTMetadata: NFTMetadata;
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;
  promises: Promise<any>[];
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;
  paginationOptions = { pageSize: 3 };

  segmentsForm: FormGroup = this.formBuilder.group({
    tab: ['assets', [Validators.required]],
  });

  constructor(
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private refreshTimeoutService: RefreshTimeoutService,
    private walletBalance: WalletBalanceService,
    private storageService: StorageService,
    private balanceCacheService: BalanceCacheService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.encryptedWalletExist();
    this.getNFTStatus();
  }

  async refresh(event: any) {
    if (this.refreshTimeoutService.isAvailable()) {
      this.uninitializedWallet();
      this.getNFTStatus();
      await this.encryptedWalletExist();
      this.refreshTimeoutService.lock();
      event.target.complete();
    } else {
      setTimeout(() => event.target.complete(), 1000);
    }
  }

  getNFTStatus() {
    this.apiWalletService.getNFTStatus().subscribe((res) => (this.nftStatus = res.status));
  }

  createNFTRequest() {
    this.apiWalletService.createNFTRequest().subscribe(() => {
      this.nftStatus = 'claimed';
    });
  }

  async encryptedWalletExist() {
    this.walletService.walletExist().then((res) => {
      this.walletExist = res;
      if (!this.alreadyInitialized && res) {
        this.alreadyInitialized = true;
        this.storageService.getAssestsSelected().then((coins) => {
          this.selectedAssets = coins;
          this.loadMore();
          this.uninitializedWallet();
        });
      }
    });
  }

  goToRecoveryWallet() {
    this.navController.navigateForward(['wallets/create-first/disclaimer', 'import']);
  }

  private uninitializedWallet() {
    this.alreadyInitialized = false;
  }

  goToSelectCoins() {
    this.navController.navigateForward(['wallets/select-coins', 'edit']);
  }

  loadMore() {
    this.selectedCoinsPage(this.paginationOptions);
  }

  getEnd(options: any): number {
    return this.balances.length + options.pageSize;
  }

  getLimit(value: number, coins: Coin[]): number {
    return value > coins.length ? coins.length : value;
  }

  algo(coin: Coin, assetBalance: AssetBalanceClass) {
    this.cachedBalance(coin, assetBalance).then(() => {
      const balancePromise = this.balanceOf(coin, assetBalance);
      const pricePromise = this.priceOf(coin, assetBalance);
      this.aggregateBalance(balancePromise, pricePromise);
    });
  }

  aggregateBalance(balancePromise: Promise<number>, pricePromise: Promise<number>): void {
    Promise.all([balancePromise, pricePromise]).then(
      ([balance, price]) => (this.totalBalanceWallet += balance * price)
    );
  }

  priceOf(coin: Coin, assetBalance: AssetBalanceClass): Promise<number> {
    return this.walletBalance.priceOf(coin).then((price) => {
      assetBalance.price = price;
      this.balanceCacheService.updateCoin(coin, { price });
      return price;
    });
  }

  balanceOf(coin: Coin, assetBalance: AssetBalanceClass): Promise<number> {
    return this.walletBalance.balanceOf(coin).then((balance) => {
      assetBalance.amount = balance;
      this.balanceCacheService.updateCoin(coin, { balance });
      return balance;
    });
  }

  cachedBalance(coin: Coin, assetBalance: AssetBalanceClass) {
    return this.balanceCacheService.coin(coin).then((cachedCoin: CachedCoin) => {
      assetBalance.amount = cachedCoin.balance;
      assetBalance.price = cachedCoin.price;
    });
  }

  selectedCoinsPage(options: any) {
    if (this.balances.length !== this.selectedAssets.length) {
      const end = this.getLimit(this.getEnd(options), this.selectedAssets);
      const page = this.selectedAssets.slice(this.balances.length, end).map((aCoin) => {
        const assetBalance = new AssetBalanceClass(aCoin);
        this.algo(aCoin, assetBalance);
        return assetBalance;
      });
      this.balances = [...this.balances, ...page];
      this.infiniteScroll && this.infiniteScroll.complete();
    } else {
      this.infiniteScroll.disabled = true;
    }
  }
}
