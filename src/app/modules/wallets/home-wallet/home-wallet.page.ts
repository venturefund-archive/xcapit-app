import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NftService } from '../shared-wallets/services/nft-service/nft.service';
import { NFTMetadata } from '../shared-wallets/interfaces/nft-metadata.interface';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';

@Component({
  selector: 'app-home-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar"> </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher (ionRefresh)="refresh($event)" slot="fixed" pull-factor="0.6" pull-min="50" pull-max="60">
        <ion-refresher-content class="refresher" close-duration="120ms" refreshingSpinner="true" pullingIcon="false">
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
                [ngClass]="{ active_tab: this.segmentsForm.value.tab === 'assets' }"
                class="ux-font-header-titulo"
                >{{ 'wallets.home.tab_assets' | translate }}</ion-label
              >
            </ion-segment-button>
            <ion-segment-button value="nft">
              <ion-label
                [ngClass]="{ active_tab: this.segmentsForm.value.tab === 'nft' }"
                class="ux-font-header-titulo"
                >{{ 'wallets.home.tab_nfts' | translate }}</ion-label
              >
            </ion-segment-button>
          </ion-segment>
        </form>
      </div>

      <div class="wt__nfts ion-padding-start ion-padding-end" *ngIf="this.segmentsForm.value.tab === 'nft'">
        <div class="wt__nfts__content">
          <app-claim-nft-card
            [nftStatus]="this.nftStatus"
            (nftRequest)="this.createNFTRequest()"
            *ngIf="this.nftStatus !== 'delivered'"
          >
          </app-claim-nft-card>
        </div>
        <div *ngIf="this.nftStatus === 'delivered' && this.NFTMetadata">
          <app-nft-card [data]="this.NFTMetadata"></app-nft-card>
        </div>
      </div>
      <div
        class="wt__balance ion-padding-start ion-padding-end"
        *ngIf="this.walletExist && this.balances?.length && this.segmentsForm.value.tab === 'assets'"
      >
        <div class="wt__balance__wallet-balance-card segment-content">
          <app-wallet-balance-card [balances]="this.balances"></app-wallet-balance-card>
        </div>
      </div>
      <div class="wt__button" *ngIf="!this.walletExist">
        <ion-button
          (click)="this.goToRecoveryWallet()"
          class="ux-font-text-ls"
          appTrackClick
          name="Import Wallet"
          type="button"
          fill="clear"
        >
          {{ 'wallets.home.wallet_recovery' | translate }}
        </ion-button>
      </div>
      <app-start-investing></app-start-investing>
    </ion-content>`,
  styleUrls: ['./home-wallet.page.scss'],
})
export class HomeWalletPage implements OnInit {
  walletExist: boolean;
  totalBalanceWallet = 0;
  walletAddress = null;
  balances: Array<AssetBalance> = [];
  allPrices: any;
  userCoins: Coin[];
  alreadyInitialized = false;
  NFTMetadata: NFTMetadata;
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;

  segmentsForm: FormGroup = this.formBuilder.group({
    tab: ['assets', [Validators.required]],
  });
  nftStatus = 'unclaimed';

  constructor(
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private storageService: StorageService,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private nftService: NftService,
    private refreshTimeoutService: RefreshTimeoutService
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

  getNFTInfo() {
    this.nftService.getNFTMetadata().then((metadata: NFTMetadata) => (this.NFTMetadata = metadata));
  }

  createBalancesStructure(coin: Coin): AssetBalance {
    return {
      icon: coin.logoRoute,
      symbol: coin.value,
      name: coin.name,
      amount: 0,
      usdAmount: 0,
      usdSymbol: 'USD',
    };
  }

  async encryptedWalletExist() {
    this.walletService.walletExist().then((res) => {
      this.walletExist = res;

      if (!this.alreadyInitialized && res) {
        this.alreadyInitialized = true;
        this.getAllPrices();
        this.getNFTInfo();
      }
    });
  }

  goToRecoveryWallet() {
    this.navController.navigateForward(['wallets/create-first/disclaimer', 'import']);
  }

  getWalletsBalances() {
    this.balances = [];
    this.totalBalanceWallet = 0;
    for (const coin of this.userCoins) {
      const walletAddress = this.walletService.addresses[coin.network];

      if (walletAddress) {
        const balance = this.createBalancesStructure(coin);
        this.walletService.balanceOf(walletAddress, coin.value).then((res) => {
          balance.amount = parseFloat(res);

          if (this.allPrices) {
            const usdPrice = this.getPrice(balance.symbol);

            balance.usdAmount = usdPrice * balance.amount;
            this.totalBalanceWallet += balance.usdAmount;
          }
          this.balances.push(balance);
        });
      }
    }
  }

  getAllPrices() {
    this.storageService.getAssestsSelected().then((coins) => {
      this.userCoins = coins;
      this.storageService.updateAssetsList().then(() => {
        this.apiWalletService
          .getPrices(this.userCoins.map((coin) => this.getCoinForPrice(coin.value)))
          .toPromise()
          .then((res) => (this.allPrices = res))
          .finally(async () => {
            this.getWalletsBalances();
            this.uninitializedWallet();
          });
      });
    });
  }

  private uninitializedWallet() {
    this.alreadyInitialized = false;
  }

  private getCoinForPrice(symbol: string): string {
    return symbol === 'RBTC' ? 'BTC' : symbol;
  }

  private getPrice(symbol: string): number {
    return this.allPrices.prices[this.getCoinForPrice(symbol)];
  }
}
