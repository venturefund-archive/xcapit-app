import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletTransactionsService } from '../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { finalize } from 'rxjs/operators';

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
            {{ this.totalBalanceWallet | number: '1.2-6' }}
            USD
          </ion-text>
        </div>
      </div>
      <div class="wt__subheader" *ngIf="this.walletExist === false && !this.transactionsExists">
        <app-wallets-subheader></app-wallets-subheader>
      </div>

      <div class="wt__overlap_buttons" *ngIf="this.walletExist === true && this.transactionsExists !== undefined">
        <app-wallet-subheader-buttons [hasTransactions]="this.transactionsExists"></app-wallet-subheader-buttons>
      </div>

      <div class="wt__balance ion-padding-start ion-padding-end" *ngIf="this.walletExist && this.balances?.length">
        <div div class="wt__balance__title">
          <ion-label class="ux-font-lato ux-fweight-bold ux-fsize-12" color="uxsemidark">
            {{ 'wallets.home.wallet_balance_title' | translate }}
          </ion-label>
        </div>
        <div class="wt__balance__wallet-balance-card">
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
      <div
        class="wt__transaction ion-padding-start ion-padding-end"
        *ngIf="this.transactionsExists && this.balances?.length"
      >
        <div div class="wt__transaction__title">
          <ion-label class="ux-font-lato ux-fweight-bold ux-fsize-12" color="uxsemidark">
            {{ 'wallets.home.wallet_transaction_title' | translate }}
          </ion-label>
        </div>
        <div class="wt__transaction__wallet-transaction-card">
          <app-wallet-transaction-card [transactions]="this.lastTransaction"></app-wallet-transaction-card>
        </div>
        <div class="wt__transaction-history">
          <ion-button
            name="Transactions History"
            id="transaction-history"
            appTrackClick
            fill="clear"
            class="ux-font-lato ux-fsize-14 ux-fweight-semibold"
            (click)="this.goToTransactionHistory()"
            >{{ 'wallets.home.go_to_history' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./home-wallet.page.scss'],
})
export class HomeWalletPage implements OnInit {
  walletExist: boolean;
  transactions: Array<any>;
  totalBalanceWallet = 0;
  walletAddress = null;
  balances: Array<AssetBalance> = [];
  allPrices: any;
  transactionsExists: boolean;
  lastTransaction = [];
  userCoins: Coin[];

  constructor(
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private storageService: StorageService,
    private walletTransactionsService: WalletTransactionsService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.encryptedWalletExist();
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

      if (res) {
        this.balances = [];
        this.getAllPrices();
        this.getLastTransactions();
      }
    });
  }

  goToRecoveryWallet() {
    this.navController.navigateForward(['wallets/create-first/disclaimer', 'import']);
  }

  async getWalletsBalances() {
    this.balances = [];
    this.totalBalanceWallet = 0;

    for (const coin of this.userCoins) {
      this.walletAddress = this.walletService.addresses[coin.network];

      if (this.walletAddress) {
        const balance = this.createBalancesStructure(coin);
        this.walletService.balanceOf(this.walletAddress, coin.value).then((res) => {
          balance.amount = parseFloat(res);

          if (this.allPrices) {
            const usdPrice = this.getPrice(balance.symbol);

            balance.usdAmount = usdPrice * balance.amount;
            this.totalBalanceWallet += balance.usdAmount;
          }

          this.balances.push(balance);

          this.walletAddress = null;
        });
      }
    }
  }

  async getAllPrices() {
    this.userCoins = await this.storageService.getAssestsSelected();
    await this.storageService.updateAssetsList();

    this.apiWalletService
      .getPrices(this.userCoins.map((coin) => this.getCoinForPrice(coin.value)))
      .pipe(finalize(() => this.getWalletsBalances()))
      .subscribe((res) => (this.allPrices = res));
  }

  private getCoinForPrice(symbol: string): string {
    return symbol === 'RBTC' ? 'BTC' : symbol;
  }

  private getPrice(symbol: string): number {
    return this.allPrices.prices[this.getCoinForPrice(symbol)];
  }

  async getLastTransactions() {
    this.walletTransactionsService.getLastTransaction().then((res) => {
      this.transactionsExists = !!(res.length > 0);

      if (this.transactionsExists) {
        this.lastTransaction = res;
      }
    });
  }

  goToTransactionHistory() {
    this.navController.navigateForward(['/wallets/transactions']);
  }
}
