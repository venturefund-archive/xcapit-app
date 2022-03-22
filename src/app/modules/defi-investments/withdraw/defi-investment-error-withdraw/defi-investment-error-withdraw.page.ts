import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-defi-investment-error-withdraw',
  template: `
    <ion-content class="ion-padding">
      <app-success-content *ngIf="this.data" [data]="this.data" imageAlt="Success Image"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./defi-investment-error-withdraw.page.scss'],
})
export class DefiInvestmentErrorWithdrawPage {
  data: any;
  vault: string;
  constructor(private route: ActivatedRoute) {}

  ionViewWillEnter() {
    this.data = SUCCESS_TYPES.error_investment;
    this.vault = this.getVault();
    this.setBackUrl();
  }

  getVault() {
    return this.route.snapshot.paramMap.get('vault');
  }

  setBackUrl() {
    this.data.urlPrimaryAction = `defi/withdraw/${this.vault}`;
  }
}
