import { Component, Input, OnInit } from '@angular/core';
import { Transfer } from '../../models/transfer/transfer.interface';

@Component({
  selector: 'app-wallet-transaction-card',
  template: `
    <div class="wtc">
      <ion-list class="wtc__list ">
        <app-wallet-transaction-card-item
          *ngFor="let transfer of this.transfers; let last = last"
          [transfer]="transfer"
          [network]="this.network"
          [last]="last"
        ></app-wallet-transaction-card-item>
      </ion-list>
    </div>
  `,
  styleUrls: ['./wallet-transaction-card.component.scss'],
})
export class WalletTransactionCardComponent implements OnInit {
  @Input() transfers: Transfer[];
  @Input() network: string;

  constructor() {
  }

  ngOnInit() {
  }
}
