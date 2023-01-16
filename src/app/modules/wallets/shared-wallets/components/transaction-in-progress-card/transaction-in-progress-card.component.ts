import { Component, Input, OnInit } from '@angular/core';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress';
import { CircleProgressComponent } from 'src/app/shared/components/circle-progress/circle-progress.component';
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
        <div class="tipc__container__timestamp">
          <ion-text class="ux-font-titulo-xs">{{ this.transactionType.startTimestamp | date: 'HH:mm' }} {{ 'fiat_ramps.kripton_operation_detail.hours' | translate }}</ion-text>
        </div>
      </div>
    </ion-item>
  `,
  styleUrls: ['./transaction-in-progress-card.component.scss'],
})
export class TransactionInProgressCardComponent implements OnInit {
  @Input() transaction: TxInProgress;
  title: string;
  imgUrl: string;

  ngOnInit() {
    console.log(this.transaction)
    this.title = `wallets.home.transaction_in_progress.${this.transaction.type}_title`;
    this.imgUrl = `assets/img/shared/transactions/${this.transaction.type}.svg`;
  }
}
