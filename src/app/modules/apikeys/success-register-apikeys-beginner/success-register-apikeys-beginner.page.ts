import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';

@Component({
  selector: 'app-success-register-apikeys-beginner',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-register-apikeys-beginner.page.scss'],
})
export class SuccessRegisterApikeysBeginnerPage implements OnInit {
  data: any;
  existWallet: boolean;
  constructor(private walletService: WalletService) {}

  ngOnInit() {
    this.walletExist();
    this.asignData();
  }

  walletExist() {
    // const data = SUCCESS_TYPES.apikeys_register_success_begginer;
    this.walletService.walletExist().then((res) => {
      this.existWallet = res;
      // if (this.existWallet) {
      //   data.urlThirdAction = '/fiat-ramps/moonpay';
      // } else {
      //   data.urlThirdAction = '/fiat-ramps/no-wallet-to-buy';
      // }
    });
  }

  asignData() {
    this.data = SUCCESS_TYPES.apikeys_register_success_begginer;
  }
}
