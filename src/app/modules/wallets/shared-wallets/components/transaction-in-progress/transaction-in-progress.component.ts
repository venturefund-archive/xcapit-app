import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TxInProgressService } from 'src/app/modules/swaps/shared-swaps/services/tx-in-progress/tx-in-progress.service';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress';

@Component({
  selector: 'app-transaction-in-progress',
  template: `
    <div class="tip" *ngIf="this.numberOfOperations > 0">
      <div class="tip__toggle" *ngIf="this.numberOfOperations > 1">
        <ion-accordion-group color="primary">
          <ion-accordion class="ion-no-padding" value="toggle">
            <ion-item slot="header">
              <div class="tip__toggle__img">
                <img src="assets/img/shared/transactions/operations.svg" />
              </div>
              <div class="tip__toggle__container">
                <div class="tip__toggle__container__title">
                  <ion-text class=" ux-font-header-titulo">
                    ({{ this.numberOfOperations }}) {{ 'wallets.home.transaction_in_progress.title' | translate }}
                  </ion-text>
                </div>
                <div class="tip__toggle__container__badge">
                  <ion-badge>{{ 'wallets.home.transaction_in_progress.badge' | translate }}</ion-badge>
                </div>
              </div>
            </ion-item>
            <div class="tip__toggle__content" slot="content">
              <div class="tip__toggle__content__card" *ngFor="let transaction of this.txsInProgress">
                <app-transaction-in-progress-card [transaction]="transaction"></app-transaction-in-progress-card>
              </div>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </div>
      <div class="tip__single-operation" *ngIf="this.numberOfOperations === 1">
        <app-transaction-in-progress-card
          [showAsSingleCard]="true"
          [transaction]="this.txsInProgress[0]"
        ></app-transaction-in-progress-card>
      </div>
    </div>
  `,
  styleUrls: ['./transaction-in-progress.component.scss'],
})
export class TransactionInProgressComponent implements OnInit {
  txsInProgress: TxInProgress[];
  numberOfOperations = 0;
  private subscription$: Subscription;

  constructor(private txInProgressService: TxInProgressService) {}

  ngOnInit() {
    this.subscribeToTxsInProgress();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  private subscribeToTxsInProgress() {
    this.subscription$ = this.txInProgressService.inProgress().subscribe((inProgress) => {
      this.txsInProgress = inProgress;
      this.getNumberOfOperations();
    });
  }

  private getNumberOfOperations() {
    this.numberOfOperations = this.txsInProgress.length;
  }

  private unsubscribe() {
    this.subscription$.unsubscribe();
  }
}
