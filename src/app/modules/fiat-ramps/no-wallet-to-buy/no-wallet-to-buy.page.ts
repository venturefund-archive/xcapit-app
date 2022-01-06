import { Component, OnInit } from '@angular/core';
import { NO_WALLET_TYPES } from 'src/app/shared/components/no-wallet/no-wallet-types.constant';

@Component({
  selector: 'app-no-wallet-to-buy',
  template: `
    <ion-content class="ion-padding">
      <app-no-wallet [data]="this.data"></app-no-wallet>
    </ion-content>
  `,
  styleUrls: ['./no-wallet-to-buy.page.scss'],
})
export class NoWalletToBuyPage implements OnInit {
  data: any;

  constructor() {}

  ngOnInit() {
    this.data = NO_WALLET_TYPES.no_wallet_fiat_ramps;
  }
}
