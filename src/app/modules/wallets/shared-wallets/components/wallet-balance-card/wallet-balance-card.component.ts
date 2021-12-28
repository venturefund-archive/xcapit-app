import { Component, Input, OnInit } from '@angular/core';
import { AssetBalance } from '../../interfaces/asset-balance.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet-balance-card',
  template: `
    <div class="wbc">
      <div class="wbc__button ion-padding-end">
        <ion-button
          appTrackClick
          name="Edit Tokens"
          class="ion-no-margin"
          fill="clear"
          size="small"
          (click)="this.goToSelectCoins()"
        >
          <ion-icon icon="ux-adjustments"></ion-icon>
        </ion-button>
      </div>
      <app-wallet-balance-card-item
        *ngFor="let balance of this.balances; let last = last"
        [balance]="balance"
        [last]="last"
      ></app-wallet-balance-card-item>
    </div>
  `,
  styleUrls: ['./wallet-balance-card.component.scss'],
})
export class WalletBalanceCardComponent implements OnInit {
  @Input() balances: AssetBalance[];
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToSelectCoins() {
    this.navController.navigateForward(['wallets/select-coins', 'edit']);
  }
}
