import { Component, OnInit } from '@angular/core';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';

@Component({
  selector: 'app-fund-investment',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/fund-name"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          (this.fundRenew
            ? 'funds.fund_investment.header_renew'
            : 'funds.fund_investment.header'
          ) | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div *ngFor="let product of this.investments_products">
        <app-investment-product-card
          [product]="this.product"
          (save)="this.handleSubmit($event)"
        ></app-investment-product-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-investment.page.scss'],
})
export class FundInvestmentPage implements OnInit {
  investments_products = [
    {
      profile: 'volume_profile_strategies_USDT',
      min_capital: '150',
      annual_interest: '90.96',
    },
    {
      profile: 'volume_profile_strategies_BTC',
      min_capital: '150',
      annual_interest: '35.83',
    },
    {
      profile: 'DeFi_index',
      min_capital: '500',
      annual_interest: '200.73',
    },
    {
      profile: 'Mary_index',
      min_capital: '500',
      annual_interest: '42.73',
    },
  ];

  fundRenew: any;

  constructor(
    public submitButtonService: SubmitButtonService,
    private fundDataStorage: FundDataStorageService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.fundDataStorage.getData('fundRenew').then((data) => {
      this.fundRenew = data;
    });
  }

  handleSubmit(data: any) {
    this.fundDataStorage.setData('fundRiskLevel', {
      risk_level: data.risk_level,
    });
    this.fundDataStorage.setData('fundCurrency', { currency: data.currency });
    this.navController.navigateForward(['funds/fund-take-profit']);
  }
}
