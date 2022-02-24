import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-wallet-password-change-success',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content
        [data]="this.data"
        imageName="wallet-password-change/password-change-success.svg"
        imageAlt="Success Image"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./wallet-password-change-success.page.scss'],
})
export class WalletPasswordChangeSuccessPage implements OnInit {
  data: any;
  constructor() { }

  ngOnInit() {
    this.data = SUCCESS_TYPES.success_wallet_password_change;
  }
}
