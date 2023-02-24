import { Component, Input, OnInit } from '@angular/core';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress.interface';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { ScanUrlOf } from '../../../models/scan-url-of/scan-url-of';

@Component({
  selector: 'app-transaction-in-progress-card',
  template: `
    <ion-item
      class="tipc ion-no-padding"
      lines="none"
      (click)="goToScanner()"
      [ngClass]="this.showAsSingleCard ? 'single-card' : ''"
    >
      <div class="tipc__container">
        <div class="tipc__container__img">
          <img [src]="this.imgUrl" />
        </div>
        <div class="tipc__container__content">
          <ion-text class="ux-font-header-titulo">{{ this.title | translate }}</ion-text>
          <div *ngIf="this.showAsSingleCard">
            <ion-badge>{{ 'wallets.home.transaction_in_progress.badge' | translate }}</ion-badge>
          </div>
        </div>
        <div class="tipc__container__timestamp">
          <ion-text class="ux-font-titulo-xs"
            >{{ this.startTimestamp | date : 'HH:mm' }}
            {{ 'fiat_ramps.kripton_operation_detail.hours' | translate }}</ion-text
          >
        </div>
      </div>
    </ion-item>
  `,
  styleUrls: ['./transaction-in-progress-card.component.scss'],
})
export class TransactionInProgressCardComponent implements OnInit {
  @Input() transaction: TxInProgress;
  @Input() showAsSingleCard = false;
  title: string;
  imgUrl: string;
  startTimestamp: Date;

  constructor(private browserService: BrowserService) {}

  ngOnInit() {
    this.title = `wallets.home.transaction_in_progress.${this.transaction.type()}_title`;
    this.imgUrl = `assets/img/shared/transactions/${this.transaction.type()}.svg`;
    this.startTimestamp = this.transaction.timestamp();
  }

  goToScanner() {
    if (this.transaction.type() === 'send') {
      this.browserService.open({
        url: ScanUrlOf.create(this.transaction.hash().value(), this.transaction.blockchain().name()).value(),
      });
    }
  }
}
