import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from '../../../../shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-defi-investment-success-withdraw',
  template: ` <ion-content class="ion-padding">
    <app-success-content [data]="this.data"></app-success-content>
  </ion-content>`,
  styleUrls: ['./defi-investment-success-withdraw.page.scss'],
})
export class DefiInvestmentSuccessWithdrawPage implements OnInit {
  data: any;
  constructor() {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.success_defi_withdraw;
  }
}
