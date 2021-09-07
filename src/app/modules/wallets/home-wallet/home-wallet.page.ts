import { Component, OnInit } from '@angular/core';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { COINS } from '../constants/coins';
import { NavController } from '@ionic/angular';

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
            ETH
          </ion-text>
        </div>
      </div>
      <div class="wt__subheader" *ngIf="this.balances?.length == 0">
        <app-wallets-subheader [walletExist]="this.walletExist"></app-wallets-subheader>
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
      <div class="wt__button">
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
  walletExist = false;
  transactions: Array<any>;
  totalBalanceWallet = 0;
  walletAddress = null;
  balances: Array<AssetBalance> = [];

  coins = COINS;

  constructor(private navController: NavController, private walletService: WalletService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.encryptedWalletExist();
  }

  pushBalancesStructure(coin) {
    const balance = {
      icon: coin.logoRoute,
      symbol: coin.value,
      name: coin.name,
      amount: 0,
      usdAmount: 0,
      usdSymbol: 'USD',
    };

    this.balances.push(balance);
  }

  encryptedWalletExist() {
    this.walletService.walletExist().then((res) => {
      this.walletExist = res;

      if (res) {
        this.balances = [];
        this.getWalletsBalances();
      }
    });
  }

  goToRecoveryWallet() {
    this.navController.navigateForward(['wallets/create-first/disclaimer', 'import']);
  }

  getWalletsBalances() {
    for (const coin of this.coins) {
      this.walletAddress = this.walletService.addresses[coin.network];

      if (this.walletAddress) {
        this.pushBalancesStructure(coin);

        this.walletService.balanceOf(this.walletAddress, coin.value).then((balance) => {
          const balanceKey = Object.keys(this.balances).filter((key) => this.balances[key].symbol === coin.value)[0];
          this.balances[balanceKey].amount = parseFloat(balance);
          // this.balances[balanceKey].usdAmount = parseFloat(usdBalance);
          // this.totalBalanceWallet = parseFloat(usdBalance);

          this.walletAddress = null;
        });
      }
    }
  }
}
