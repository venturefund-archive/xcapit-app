import { Component, OnInit } from '@angular/core';
import { WalletTransactionsService } from '../shared-wallets/services/wallet-transactions/wallet-transactions.service';

@Component({
  selector: 'app-transactions-wallet',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.transactions.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="wt__transactions ion-padding-start ion-padding-end">
        <div class="wt__transactions__wallet-transaction-card">
          <app-wallet-transaction-card [transactions]="this.allTransactions"></app-wallet-transaction-card>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./transactions-wallet.page.scss'],
})
export class TransactionsWalletPage implements OnInit {
  allTransactions = [];

  constructor(private walletTransactionsService: WalletTransactionsService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getAllTransactions();
  }

  async getAllTransactions() {
    this.walletTransactionsService.getAllTransactions().then((res) => {
      this.allTransactions = res;
    });
  }
}
