import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-wallet-password-change-error',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content
        [data]="this.data"
        imageName="../../../../assets/img/wallet-password-change/password-change-error.svg"
        imageAlt="Error Image"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./wallet-password-change-error.page.scss'],
})
export class WalletPasswordChangeErrorPage implements OnInit {
  data: any;
  constructor() {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.error_wallet_password_change;
  }
}
