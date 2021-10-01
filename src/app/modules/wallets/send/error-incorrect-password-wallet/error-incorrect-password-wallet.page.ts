import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-error-incorrect-password-wallet',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content
        [data]="this.data"
        imageName="ux-error-open-lock.svg"
        imageAlt="Error Image"
        (primaryActionEvent)="this.goBackToSummary()"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./error-incorrect-password-wallet.page.scss'],
})
export class ErrorIncorrectPasswordWalletPage implements OnInit {
  data: any;
  constructor(private navController: NavController) {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.error_wallet_incorrect_password;
  }

  goBackToSummary() {
    this.navController.navigateBack('/wallets/send/summary/retry');
  }
}
