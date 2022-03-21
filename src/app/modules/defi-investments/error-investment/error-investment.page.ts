import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SUCCESS_TYPES } from '../../../shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-error-investment',
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
  styleUrls: ['./error-investment.page.scss'],
})
export class ErrorInvestmentPage {
  data: any;
  vault: string;
  constructor(private route: ActivatedRoute) {}

  ionViewWillEnter() {
    this.data = SUCCESS_TYPES.error_investment;
    this.vault = this.getVault();
    this.setBackUrl();
  }

  setBackUrl() {
    if (this.vault) {
      this.data.urlPrimaryAction = `defi/new/insert-amount/${this.vault}/add`;
    }
  }

  getVault() {
    return this.route.snapshot.paramMap.get('vault');
  }
}
