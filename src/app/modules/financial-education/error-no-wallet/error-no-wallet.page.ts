import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-error-no-wallet',
  template: `<ion-content class="ion-padding">
  <app-success-content *ngIf="this.data" [data]="this.data"></app-success-content>
</ion-content>`,
  styleUrls: ['./error-no-wallet.page.scss'],
})
export class ErrorNoWalletPage implements OnInit {
  data = SUCCESS_TYPES.error_no_wallet_financial_education;
  constructor() { }

  ngOnInit() {
  }
}
