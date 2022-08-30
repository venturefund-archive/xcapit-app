import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet-transaction-card',
  template: `
    <div class="wtc">
      <ion-list class="wtc__list ">
        <app-wallet-transaction-card-item
          *ngFor="let transaction of this.transactions; let last = last"
          [transaction]="transaction"
          [network]="this.network"
          [last]="last"
        ></app-wallet-transaction-card-item>
      </ion-list>
    </div>
  `,
  styleUrls: ['./wallet-transaction-card.component.scss'],
})
export class WalletTransactionCardComponent implements OnInit {
  @Input() transactions: any[];
  @Input() network: string;

  constructor() {}

  ngOnInit() {}
}
