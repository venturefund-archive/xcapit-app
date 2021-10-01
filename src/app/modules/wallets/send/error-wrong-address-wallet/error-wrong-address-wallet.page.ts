import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';

@Component({
  selector: 'app-error-incorrect-password-wallet',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content
        [data]="this.data"
        imageName="ux-error-wallet.svg"
        imageAlt="Error Image"
        (primaryActionEvent)="this.goBackToDetail()"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./error-wrong-address-wallet.page.scss'],
})
export class ErrorWrongAddressWalletPage implements OnInit {
  data: any;
  constructor(private navController: NavController, private transactionDataService: TransactionDataService) {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.error_wallet_wrong_address;
  }

  goBackToDetail() {
    const coinValue = this.transactionDataService.transactionData.currency.value;
    this.navController.navigateBack(`/wallets/send/detail/${coinValue}`);
  }
}
