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

@Component({
  selector: 'app-home-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar"> </ion-toolbar>
    </ion-header>

    <ion-content>
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
        <div class="wt__nfts__content segment-content">
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
          class="ux-font-text-xs"
          appTrackClick
          name="Import Wallet"
          type="button"
          color="uxsecondary"
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
  walletAddress = null;
  balances: Array<AssetBalance> = [];
  allPrices: any;
  userCoins: Coin[];
  alreadyInitialized = false;
  NFTMetadata: NFTMetadata;

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
    private nftService: NftService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.encryptedWalletExist();
    this.getNFTStatus();
    this.getNFTInfo();
  }

  getNFTStatus() {
    this.apiWalletService.getNFTStatus().subscribe((res) => (this.nftStatus = res.status));
  }

  createNFTRequest() {
    this.apiWalletService.createNFTRequest().subscribe(() => this.getNFTStatus());
  }

  getNFTInfo() {
    this.nftService.getNFTMetadata().then((metadata: NFTMetadata) => (this.NFTMetadata = metadata));
  }

  createBalancesStructure(coin: Coin): AssetBalance {
    const balance: AssetBalance = {
      icon: coin.logoRoute,
      symbol: coin.value,
      name: coin.name,
      amount: 0,
      usdAmount: 0,
      usdSymbol: 'USD',
    };

    return balance;
  }

  async encryptedWalletExist() {
    this.walletService.walletExist().then((res) => {
      this.walletExist = res;

      if (!this.alreadyInitialized && res) {
        this.alreadyInitialized = true;
        this.balances = [];
        this.getAllPrices();
      }
    });
  }

  goToRecoveryWallet() {
    this.navController.navigateForward(['wallets/create-first/disclaimer', 'import']);
  }

  getWalletsBalances() {
    for (const coin of this.userCoins) {
      const walletAddress = this.walletService.addresses[coin.network];

      if (walletAddress) {
        const balance = this.createBalancesStructure(coin);
        this.walletService
          .balanceOf(walletAddress, coin.value)

          .then((res) => {
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
            this.alreadyInitialized = false;
          });
      });
    });
  }

  private getCoinForPrice(symbol: string): string {
    return symbol === 'RBTC' ? 'BTC' : symbol;
  }

  private getPrice(symbol: string): number {
    return this.allPrices.prices[this.getCoinForPrice(symbol)];
  }
}
