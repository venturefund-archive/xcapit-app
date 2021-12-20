import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AssetBalance } from 'src/app/modules/wallets/shared-wallets/interfaces/asset-balance.interface';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-wallet-balance-card-home',
  template: `
    <div class="wbc">
      <div class="wbc__content" *ngIf="!this.walletExist">
        <div class="wbc__content__body">
          <div class="ux-font-text-lg wbc__content__body__title">{{ '¡Quiero mi Wallet!' }}</div>
          <div class="ux-font-text-xxs wbc__content__body__subtitle">
            {{ 'Crea tu wallet y comienza a tener el control de tus finanzas.' }}
          </div>
        </div>
        <img src="/assets/img/wallets/Coins.svg" />
      </div>
      <div class="wbc__content_balance" *ngIf="this.walletExist">
        <div class="wbc__content_balance__body">
          <img src="assets/ux-icons/ux-wallet-circle.svg" />
          <div class="ux-font-text-xl wbc__content_balance__body__balance">
            {{
              (this.totalBalanceWallet ? this.totalBalanceWallet : '0.00')
                | number: '1.2-2'
                | hideText: this.hideFundText
            }}
            USD
            <div class="ux-font-text-xxs wbc__content_balance__body__description">{{ 'En tu Wallet' }}</div>
          </div>
          <a class="wbc__content_balance__body__eye-button" (click)="this.hideText()">
            <ion-icon class="eye-button" [hidden]="!this.hideFundText" name="eye-off-outline"></ion-icon>
            <ion-icon class="eye-button" [hidden]="this.hideFundText" name="eye-outline"></ion-icon>
          </a>
        </div>
      </div>
      <div class="wbc__arrow" name="Go To Home Wallet" (click)="this.goToHomeWallet()" appTrackClick>
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </div>
    </div>
  `,
  styleUrls: ['./wallet-balance-card-home.component.scss'],
})
export class WalletBalanceCardHomeComponent implements OnInit {
  totalBalanceWallet: number;
  balances: Array<AssetBalance> = [];
  walletExist: boolean;
  hideFundText: boolean;

  constructor(
    private navController: NavController,
    private localStorageService: LocalStorageService,
    private walletService: WalletService,
    private walletBalance: WalletBalanceService
  ) {}

  ngOnInit() {
    this.existWallet();
    this.subscribeOnHideFunds();
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  hideText() {
    this.localStorageService.toggleHideFunds();
  }

  goToHomeWallet() {
    this.navController.navigateForward(['tabs/wallets']);
  }

  existWallet() {
    this.walletService.walletExist().then((res) => {
      this.walletExist = res;
      this.getCoinsBalance();
    });
  }

  getCoinsBalance() {
    this.walletBalance.getWalletsBalances().then((res) => {
      this.balances = res;
      this.getTotalBalance();
    });
  }

  getTotalBalance() {
    this.walletBalance.getUsdTotalBalance().then((res) => (this.totalBalanceWallet = res));
  }
}
