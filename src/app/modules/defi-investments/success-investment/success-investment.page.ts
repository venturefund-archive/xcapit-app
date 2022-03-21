import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from '../../../shared/components/success-content/success-types.constant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-investment',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content
        *ngIf="this.data"
        [data]="this.data"
        imageName="wallet-password-change/password-change-success.svg"
        imageAlt="Success Image"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-investment.page.scss'],
})
export class SuccessInvestmentPage {
  data: any;
  constructor(private route: ActivatedRoute) {}

  ionViewWillEnter() {
    this.data = this.newInvestment() ? SUCCESS_TYPES.success_investment : SUCCESS_TYPES.success_add_amount;
  }

  newInvestment() {
    return this.route.snapshot.paramMap.get('type') === 'invest';
  }
}
