import { Component, OnInit } from '@angular/core';
import { NoWalletData } from 'src/app/shared/components/no-wallet/no-wallet-data.interface';
import { NO_WALLET_TYPES } from 'src/app/shared/components/no-wallet/no-wallet-types.constant';

@Component({
  selector: 'app-send-donation-no-wallet',
  template: ` <ion-content class="ion-padding">
    <app-no-wallet [data]="this.data"></app-no-wallet>
  </ion-content>`,
  styleUrls: ['./send-donation-no-wallet.page.scss'],
})
export class SendDonationNoWalletPage implements OnInit {
  data: NoWalletData;
  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.data = NO_WALLET_TYPES.no_wallet_to_donate;
  }
}
