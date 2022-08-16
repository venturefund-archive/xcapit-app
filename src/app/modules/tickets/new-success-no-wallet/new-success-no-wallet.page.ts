import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-new-success-no-wallet',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./new-success-no-wallet.page.scss'],
})
export class NewSuccessNoWalletPage implements OnInit {
  data: any;
  constructor() { }

  ngOnInit() {
    this.data = SUCCESS_TYPES.create_ticket_no_wallet
  }

}
