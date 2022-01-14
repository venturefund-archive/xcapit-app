import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NFTMetadata } from '../shared-wallets/interfaces/nft-metadata.interface';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { WalletBalanceService } from '../shared-wallets/services/wallet-balance/wallet-balance.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { BalanceCacheService } from '../shared-wallets/services/balance-cache/balance-cache.service';
import { AssetBalanceModel } from '../shared-wallets/models/asset-balance/asset-balance.class';
import { QueueService } from '../../../shared/services/queue/queue.service';
import { Subscription } from 'rxjs';

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
          <app-wallet-balance-card-item
            *ngFor="let balance of this.balances; let last = last"
            [balance]="balance"
            [last]="last"
          ></app-wallet-balance-card-item>
        </div>
        <div class="wt__start-investing">
          <app-start-investing></app-start-investing>
        </div>
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
      <ion-infinite-scroll threshold="10px" (ionInfinite)="this.loadCoins()">
        <ion-infinite-scroll-content
          loadingSpinner="bubbles"
          loadingText="{{ 'funds.fund_operations.loading_infinite_scroll' | translate }}"
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>`,
  styleUrls: ['./home-wallet.page.scss'],
})
export class HomeWalletPage implements OnInit {
  walletExist: boolean;
  totalBalanceWallet = 0;
  balances: AssetBalanceModel[] = [];
  nftStatus = '';
  selectedAssets: Coin[];
  NFTMetadata: NFTMetadata;
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  pageSize = 6;
  subscriptions$: Subscription[] = [];

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
    private balanceCacheService: BalanceCacheService,
    private queueService: QueueService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.initialize();
  }

  async initialize(): Promise<void> {
    this.clearBalances();
    await this.checkWalletExist();
    await this.getAssetsSelected();
    this.createQueues();
    this.loadCoins();
    this.getNFTStatus();
  }

  private createQueues(): void {
    for (const network of this.apiWalletService.getNetworks()) {
      this.queueService.create(network, 2);
      this.subscriptions$.push(this.queueService.results(network).subscribe());
    }
    this.queueService.create('prices', 2);
    this.subscriptions$.push(this.queueService.results('prices').subscribe());
  }

  private clearBalances(): void {
    this.balances = [];
    this.totalBalanceWallet = 0;
  }

  async refresh(event: any): Promise<void> {
    if (this.refreshTimeoutService.isAvailable()) {
      this.infiniteScroll.disabled = false;
      await this.initialize();
      this.refreshTimeoutService.lock();
    }
    setTimeout(() => event.target.complete(), 1000);
  }

  private getNFTStatus(): void {
    this.apiWalletService.getNFTStatus().subscribe((res) => (this.nftStatus = res.status));
  }

  createNFTRequest(): void {
    this.apiWalletService.createNFTRequest().subscribe(() => {
      this.nftStatus = 'claimed';
    });
  }

  private async checkWalletExist(): Promise<void> {
    this.walletExist = await this.walletService.walletExist();
  }

  private async getAssetsSelected(): Promise<void> {
    this.selectedAssets = await this.storageService.getAssestsSelected();
  }

  goToRecoveryWallet(): void {
    this.navController.navigateForward(['wallets/create-first/disclaimer', 'import']);
  }

  goToSelectCoins(): void {
    this.navController.navigateForward(['wallets/select-coins', 'edit']);
  }

  private finishedLoad(): boolean {
    return this.balances.length === this.selectedAssets.length;
  }

  loadCoins(): void {
    if (!this.finishedLoad()) {
      this.loadNextPage();
      this.infiniteScroll && this.infiniteScroll.complete();
    } else {
      this.infiniteScroll.disabled = true;
    }
  }

  private endPageIndex(): number {
    return Math.min(this.balances.length + this.pageSize, this.selectedAssets.length);
  }

  private loadNextPage(): void {
    const page = this.selectedAssets.slice(this.balances.length, this.endPageIndex()).map((aCoin: Coin) => {
      const assetBalance = new AssetBalanceModel(aCoin, this.walletBalance, this.balanceCacheService);
      assetBalance.cachedBalance().then(() => {
        this.enqueue(assetBalance);
      });
      this.sumTotalBalance(assetBalance);
      return assetBalance;
    });
    this.balances = [...this.balances, ...page];
  }

  private sumTotalBalance(assetBalance: AssetBalanceModel): void {
    assetBalance.quoteBalance.subscribe((quote: number) => (this.totalBalanceWallet += quote));
  }

  private enqueue(assetBalance: AssetBalanceModel): void {
    this.queueService.enqueue(assetBalance.coin.network, () => assetBalance.balance());
    this.queueService.enqueue('prices', () => assetBalance.getPrice());
  }

  ionViewDidLeave() {
    this.unsubscribe();
  }

  private unsubscribe(): void {
    for (const subscription of this.subscriptions$) {
      subscription.unsubscribe();
    }
  }
}
