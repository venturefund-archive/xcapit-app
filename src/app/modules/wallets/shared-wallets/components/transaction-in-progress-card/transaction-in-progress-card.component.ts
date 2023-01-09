import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../../types/transaction.type';

@Component({
  selector: 'app-transaction-in-progress-card',
  template: `
    <ion-item class="tipc ion-no-padding" lines="none">
      <div class="tipc__container">
        <div class="tipc__container__img">
          <img [src]="this.imgUrl" />
        </div>
        <div class="tipc__container__content">
          <ion-text class="ux-font-header-titulo">{{ this.title | translate }}</ion-text>
          <div>
            <ion-badge>{{ 'wallets.home.transaction_in_progress.badge' | translate }}</ion-badge>
          </div>
        </div>
      </div>
      <!-- TODO: Add hour -->
    </ion-item>
  `,
  styleUrls: ['./transaction-in-progress-card.component.scss'],
})
export class TransactionInProgressCardComponent implements OnInit {
  @Input() transactionType: Transaction;
  title: string;
  imgUrl: string;

  ngOnInit() {
    this.title = `wallets.home.transaction_in_progress.${this.transactionType}_title`;
    this.imgUrl = `assets/img/shared/transactions/${this.transactionType}.svg`;
  }
}
