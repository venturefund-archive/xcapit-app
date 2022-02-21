import { Component, OnInit } from '@angular/core';
import { NoWalletData } from '../../../shared/components/no-wallet/no-wallet-data.interface';
import { NO_WALLET_TYPES } from '../../../shared/components/no-wallet/no-wallet-types.constant';

@Component({
  selector: 'app-no-wallet-page',
  template: `
    <ion-content class="ion-padding">
      <app-no-wallet [data]="this.data"></app-no-wallet>
    </ion-content>
  `,
  styleUrls: ['./no-wallet.page.scss'],
})
export class NoWalletPage implements OnInit {
  data: NoWalletData;
  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.data = NO_WALLET_TYPES.generic;
  }
}
