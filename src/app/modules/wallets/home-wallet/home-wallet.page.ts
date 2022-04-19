import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { WalletBalanceService } from '../shared-wallets/services/wallet-balance/wallet-balance.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { BalanceCacheService } from '../shared-wallets/services/balance-cache/balance-cache.service';
import { AssetBalanceModel } from '../shared-wallets/models/asset-balance/asset-balance.class';
import { QueueService } from '../../../shared/services/queue/queue.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CovalentBalances } from '../shared-wallets/models/covalent-balances/covalent-balances';
import { TokenPrices } from '../shared-wallets/models/token-prices/token-prices';
import { TokenPrice } from '../shared-wallets/models/token-price/token-price';
import { TokenDetailList } from '../shared-wallets/models/token-detail-list/token-detail-list';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';
import { TokenDetail2 } from '../shared-wallets/models/token-detail-2/token-detail-2';

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
      <!--      <ion-refresher-->
      <!--        (ionRefresh)="this.refresh($event)"-->
      <!--        close-duration="1000ms"-->
      <!--        slot="fixed"-->
      <!--        pull-factor="0.6"-->
      <!--        pull-min="50"-->
      <!--        pull-max="60"-->
      <!--      >-->
      <!--        <ion-refresher-content class="refresher" refreshingSpinner="true" pullingIcon="false">-->
      <!--          <app-ux-loading-block *ngIf="this.isRefreshAvailable$ | async" minSize="34px"></app-ux-loading-block>-->
      <!--          <ion-text class="ux-font-text-xxs" color="neutral80" *ngIf="(this.isRefreshAvailable$ | async) === false">-->
      <!--            {{-->
      <!--              'funds.funds_list.refresh_time'-->
      <!--                | translate-->
      <!--                  : {-->
      <!--                      seconds: (this.refreshRemainingTime$ | async)-->
      <!--                    }-->
      <!--            }}-->
      <!--          </ion-text>-->
      <!--        </ion-refresher-content>-->
      <!--      </ion-refresher>-->
      <div class="wt__subheader__value">
        <div class="wt__title ux-font-text-base">
          <ion-text>
            {{ 'wallets.home.available_money' | translate }}
          </ion-text>
        </div>
        <div class="wt__amount ux-font-num-titulo">
          <ion-spinner
            color="white"
            name="crescent"
            *ngIf="this.totalBalance === undefined && this.walletExist"
          ></ion-spinner>
          <ion-text *ngIf="this.totalBalance !== undefined || !this.walletExist">
            {{ (this.totalBalance ? this.totalBalance : 0.0) | number: '1.2-2' }} USD
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
          <app-nft-card *ngIf="this.walletExist"></app-nft-card>
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
            *ngFor="let tokenDetail of this.tokenDetails; let last = last"
            [tokenDetail]="tokenDetail"
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
    </ion-content>`,
  styleUrls: ['./home-wallet.page.scss'],
})
export class HomeWalletPage implements OnInit {
  walletExist: boolean;
  totalBalanceAccum = 0;
  // balances: AssetBalanceModel[] = [];
  tokenDetails: TokenDetail2[] = [];
  userTokens: Coin[];
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  pageSize = 6;
  leave$ = new Subject<void>();
  segmentsForm: FormGroup = this.formBuilder.group({
    tab: ['assets', [Validators.required]],
  });
  requestQuantity = 0;
  totalBalance: number;

  constructor(
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private refreshTimeoutService: RefreshTimeoutService,
    private walletBalance: WalletBalanceService,
    private storageService: StorageService,
    private balanceCacheService: BalanceCacheService,
    private queueService: QueueService,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.checkWalletExist();
    await this.setUserTokens();
    this.tokenDetails = [];
    for (const network of this.apiWalletService.getNetworks()) {
      const tokens = this.userTokens.filter((token) => token.network === network);
      const address = await this.storageService.getWalletsAddresses(network);

      const balances = new CovalentBalances(address, tokens, this.http);
      const prices = new TokenPrices(tokens, this.http);

      await balances.value();
      

      const news = this.userTokens
        .filter((token) => token.network === network)
        .map((token) => {
          const tokenDetail = new TokenDetail2(balances, prices, token);
          tokenDetail.fetch();
          return tokenDetail;
        });
      this.tokenDetails = [...this.tokenDetails, ...news];
    }


    // const addressPOLYGON = await this.storageService.getWalletsAddresses('MATIC'); // const addressBSC = await this.storageService.getWalletsAddresses('BSC_BEP20'); // const addressRSK = await this.storageService.getWalletsAddresses('RSK');
    // const balancesPOLYGON = new CovalentBalances(addressPOLYGON, coinsPOLYGON, this.http);
    // const pricesPOLYGON = new TokenPrices(coinsPOLYGON, this.http);
    // const balancesBSC = new CovalentBalances(addressBSC, coinsBSC, this.http);
    // const pricesBSC = new TokenPrices(coinsBSC, this.http);
    // const balancesRSK = new CovalentBalances(addressRSK, coinsRSK, this.http);
    // const pricesRSK = new TokenPrices(coinsRSK, this.http);
    // new TokenDetailList(balancesERC20, pricesERC20)
    //   .all()
    //   .then((res) => (this.tokenDetails = this.tokenDetails.concat(res)));
    // new TokenDetailList(balancesPOLYGON, pricesPOLYGON)
    //   .all()
    //   .then((res) => (this.tokenDetails = this.tokenDetails.concat(res)));
    // new TokenDetailList(balancesBSC, pricesBSC)
    //   .all()
    //   .then((res) => (this.tokenDetails = this.tokenDetails.concat(res)));
    // new TokenDetailList(balancesRSK, pricesRSK)
    //   .all()
    //   .then((res) => (this.tokenDetails = this.tokenDetails.concat(res)));

    // const otro = new TokenPrice(prices, coins[0]);
    // const usdc = new TokenPrice(prices, coins[2]);
    // usdc.value().then((res) => console.log(res));
    // otro.value().then((res) => console.log(res));
    // const results = [];
    // for (const coin of coins) {
    //   results.push({coin, price:await new TokenPrice(prices, coin).value(), balance: balancesssss})
    // }
    // this.requestQuantity = 0;
    // await this.initialize();
  }

  // async initialize(): Promise<void> {
  //   this.queueService.dequeueAll();
  //   await this.content.scrollToTop(0);
  //   await this.cachedTotalBalance();
  // this.clearBalances();
  // await this.getAssetsSelected();
  // this.createQueues();
  // this.loadCoins();
  // }

  // private async cachedTotalBalance() {
  //   this.totalBalance = await this.balanceCacheService.total();
  // }

  // private createQueues(): void {
  //   for (const network of this.apiWalletService.getNetworks()) {
  //     this.queueService.create(network, 2);
  //     this.queueService.results(network).pipe(takeUntil(this.leave$)).subscribe();
  //   }
  //   this.queueService.create('prices', 2);
  //   this.queueService.results('prices').pipe(takeUntil(this.leave$)).subscribe();
  // }

  // private clearBalances(): void {
  //   this.balances = [];
  //   this.totalBalanceAccum = 0;
  // }

  // async refresh(event: any): Promise<void> {
  //   if (this.refreshTimeoutService.isAvailable()) {
  //     await this.initialize();
  //     this.refreshTimeoutService.lock();
  //   }
  //   setTimeout(() => event.target.complete(), 1000);
  // }

  private async checkWalletExist(): Promise<void> {
    this.walletExist = await this.walletService.walletExist();
  }

  private async setUserTokens(): Promise<void> {
    this.userTokens = await this.storageService.getAssestsSelected();
  }

  goToRecoveryWallet(): void {
    this.navController.navigateForward(['wallets/create-first/disclaimer', 'import']);
  }

  goToSelectCoins(): void {
    this.navController.navigateForward(['wallets/select-coins', 'edit']);
  }

  // loadCoins(): void {
  //   this.balances = this.selectedAssets.map((aCoin: Coin) => {
  //     const assetBalance = new AssetBalanceModel(aCoin, this.walletBalance, this.balanceCacheService);
  //     assetBalance.cachedBalance().then((cachedCoin) => {
  //       this.enqueue(assetBalance);
  //       if (cachedCoin) {
  //         this.orderBalances();
  //       }
  //     });
  //     this.accumulateBalance(assetBalance);
  //     return assetBalance;
  //   });
  // }
  //
  // private orderBalances() {
  //   this.balances.sort((a, b) => b.amount * b.price - a.amount * a.price);
  // }
  //
  // private accumulateBalance(assetBalance: AssetBalanceModel): void {
  //   assetBalance.quoteBalance.pipe(takeUntil(this.leave$)).subscribe(async (quote: number) => {
  //     if (!this.queueStopped()) {
  //       this.totalBalanceAccum += quote;
  //       this.requestQuantity++;
  //       if (this.accumulationEnded()) await this.updateBalance();
  //       this.orderBalances();
  //     }
  //   });
  // }
  //
  // queueStopped() {
  //   return this.leave$.isStopped;
  // }
  //
  // private accumulationEnded() {
  //   return this.requestQuantity === this.selectedAssets.length;
  // }
  //
  // private async updateBalance() {
  //   this.totalBalance = this.totalBalanceAccum;
  //   this.balanceCacheService.updateTotal(this.totalBalanceAccum);
  // }
  //
  // private enqueue(assetBalance: AssetBalanceModel): void {
  //   this.queueService.enqueue(assetBalance.coin.network, () => assetBalance.balance());
  //   this.queueService.enqueue('prices', () => assetBalance.getPrice());
  // }
  //
  // ionViewDidLeave(): void {
  //   this.leave$.complete();
  // }
}
