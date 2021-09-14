import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-recovery-wallet',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content
        [data]="this.data"
        imageName="../../../../assets/img/wallets/success_celebration.svg"
        imageAlt="Success Image"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-recovery-wallet.page.scss'],
})
export class SuccessRecoveryWalletPage implements OnInit {
  data: any;
  constructor() {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.success_wallet_recovery;
  }
}
