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
    <ion-content class="ion-padding fi">
      <div class="fi__info">
        <div>
          <ion-text
            class="ux-font-gilroy ux-fweight-bold ux-fsize-22"
            color="uxdark"
            >{{
              'funds.fund_investment.header_info.title' | translate
            }}</ion-text
          >
        </div>
        <div class="fi__info__description">
          <ion-text
            class="ux-font-lato ux-fweight-regular ux-fsize-12"
            color="uxsemidark"
            >{{
              'funds.fund_investment.header_info.description' | translate
            }}</ion-text
          >
        </div>
      </div>
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
      profile: 'volume_profile_strategies_BTC',
      min_capital: '150',
      percentage: '5.02',
      link_info: 'https://bit.ly/factsheet-strategy2',
      risk: 3,
      currency: 'BTC'
    },
    {
      profile: 'volume_profile_strategies_USDT',
      min_capital: '150',
      percentage: '22.5',
      link_info: 'https://bit.ly/factsheet-strategy1',
      risk: 3,
      currency: 'USDT'
    },
    {
      profile: 'DeFi_index',
      min_capital: '500',
      percentage: '434.02',
      link_info: 'https://bit.ly/factsheet-strategy4',
      risk: 5,
      currency: 'USDT'
    },
    {
      profile: 'Mary_index',
      min_capital: '500',
      percentage: '160.5',
      link_info: 'https://bit.ly/factsheet-strategy3',
      risk: 4,
      currency: 'USDT'
    },
  ];

  fundRenew: any;

  constructor(
    public submitButtonService: SubmitButtonService,
    private fundDataStorage: FundDataStorageService,
    private navController: NavController
  ) {}

  ngOnInit() {}

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
