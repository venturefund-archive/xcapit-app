import { Component, OnInit } from '@angular/core';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { AlertController, NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { StorageApikeysService } from '../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { TranslateService } from '@ngx-translate/core';
import { LINKS } from '../../../config/static-links';
import { Browser } from '@capacitor/core';

@Component({
  selector: 'app-fund-investment',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/fund-name"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          (this.fundRenew ? 'funds.fund_investment.header_renew' : 'funds.fund_investment.header') | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding fi">
      <div class="fi__info">
        <div>
          <ion-text class="ux-font-gilroy ux-fweight-bold ux-fsize-22" color="uxdark">{{
            'funds.fund_investment.header_info.title' | translate
          }}</ion-text>
        </div>
        <div class="fi__info__description">
          <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12" color="uxsemidark">{{
            'funds.fund_investment.header_info.description' | translate
          }}</ion-text>
        </div>
      </div>
      <div *ngFor="let product of this.investmentsProducts">
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
  investmentsProducts = [
    {
      profile: 'volume_profile_strategies_BTC',
      min_capital: '150',
      percentage: '5.02',
      link_info: 'https://bit.ly/factsheet-strategy2',
      risk: 3,
      currency: 'BTC',
    },
    {
      profile: 'volume_profile_strategies_USDT',
      min_capital: '150',
      percentage: '22.5',
      link_info: 'https://bit.ly/factsheet-strategy1',
      risk: 3,
      currency: 'USDT',
    },
    {
      profile: 'DeFi_index',
      min_capital: '500',
      percentage: '434.02',
      link_info: 'https://bit.ly/factsheet-strategy4',
      risk: 5,
      currency: 'USDT',
    },
    {
      profile: 'Mary_index',
      min_capital: '500',
      percentage: '160.5',
      link_info: 'https://bit.ly/factsheet-strategy3',
      risk: 4,
      currency: 'USDT',
    },
  ];

  fundRenew: any;
  fundName: any;

  constructor(
    public submitButtonService: SubmitButtonService,
    private fundDataStorage: FundDataStorageService,
    private navController: NavController,
    private apiApiKeysService: ApiApikeysService,
    private storageApiKeysService: StorageApikeysService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.getFundRenewData();
  }

  async getFundRenewData() {
    this.fundRenew = await this.fundDataStorage.getData('fundRenew');
    this.fundName = await this.fundDataStorage.getData('fundName');
  }

  getDataToCheckBalance(): any {
    let result: any;
    if (this.fundRenew) {
      result = this.fundName;
    } else if (this.storageApiKeysService.data) {
      result = { id: this.storageApiKeysService.data.id };
    }
    return result;
  }

  async checkMinBalance(riskLevel: string) {
    return await this.apiApiKeysService
      .checkMinBalance({
        profile: riskLevel,
        ...this.getDataToCheckBalance(),
      })
      .toPromise();
  }

  async showNotEnoughBalanceAlert(minBalance: number) {
    const alert = await this.alertController.create({
      header: this.translate.instant('funds.fund_investment.balance_not_enough.title', { minBalance }),
      message: this.translate.instant('funds.fund_investment.balance_not_enough.message'),
      buttons: [
        {
          text: this.translate.instant('funds.fund_investment.balance_not_enough.cancel_text'),
        },
        {
          text: this.translate.instant('funds.fund_investment.balance_not_enough.ok_text'),
          handler: () => Browser.open({ url: LINKS.binance }),
        },
      ],
    });
    await alert.present();
  }

  saveProfileAndCurrency(data: any) {
    this.fundDataStorage.setData('fundRiskLevel', { risk_level: data.risk_level }).then();
    this.fundDataStorage.setData('fundCurrency', { currency: data.currency }).then();
  }

  async handleSubmit(data: any) {
    const response = await this.checkMinBalance(data.risk_level);
    if (response.balance_is_enough) {
      this.saveProfileAndCurrency(data);
      this.navController.navigateForward(['funds/fund-take-profit']).then();
    } else {
      await this.showNotEnoughBalanceAlert(response.min_balance);
    }
  }
}
