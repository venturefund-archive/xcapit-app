import { Component, Input, OnInit } from '@angular/core';
import { AssetBalance } from '../../interfaces/asset-balance.interface';

@Component({
  selector: 'app-wallet-balance-card',
  template: `
    <div class="wbc">
      <ion-list class="wbc__list ">
        <app-wallet-balance-card-item
          *ngFor="let balance of this.balances; let last = last"
          [balance]="balance"
          [last]="last"
        ></app-wallet-balance-card-item>
      </ion-list>
    </div>
  `,
  styleUrls: ['./wallet-balance-card.component.scss'],
})
export class WalletBalanceCardComponent implements OnInit {
  @Input() balances: AssetBalance[];

  constructor() {}

  ngOnInit() {}
}
