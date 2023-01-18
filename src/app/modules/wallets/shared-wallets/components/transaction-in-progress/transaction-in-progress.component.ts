import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TxInProgressService } from 'src/app/modules/swaps/shared-swaps/services/tx-in-progress/tx-in-progress.service';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress';

@Component({
  selector: 'app-transaction-in-progress',
  template: `
    <div class="tipc" *ngIf="this.numberOfOperations > 0">
      <div class="tipc__toggle" *ngIf="this.numberOfOperations > 1">
        <ion-accordion-group>
          <ion-accordion class="ion-no-padding" value="toggle">
            <ion-item slot="header"></ion-item>
            <div class="tipc__toggle__content" slot="content">
              <div class="tipc__toggle__content__card" *ngFor="let transaction of this.txsInProgress">
                <app-transaction-in-progress-card [transaction]="transaction"></app-transaction-in-progress-card>
              </div>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </div>
      <div class="tipc__single-operation" *ngIf="this.numberOfOperations === 1">
        <app-transaction-in-progress-card [transaction]="this.txsInProgress[0]"></app-transaction-in-progress-card>
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
    this.subscribeToSwapInProgress();
  }

  ngOnDestroy() {
    // this.unsubscribe();
  }

  private subscribeToSwapInProgress() {
    // this.subscription$ = this.txInProgressService.inProgress().subscribe((inProgress) => {
    //   this.operationsInProgress = inProgress;
    //   this.getNumberOfOperations();
    // });
    this.txsInProgress = [new TxInProgress('send'), new TxInProgress('swap')];
    this.getNumberOfOperations();
  }

  private getNumberOfOperations() {
    this.numberOfOperations = this.txsInProgress.length;
  }
}
