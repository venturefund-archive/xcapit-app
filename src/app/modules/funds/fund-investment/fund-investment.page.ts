import { Component, OnInit } from '@angular/core';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { StorageApikeysService } from '../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { NoApikeysModalComponent } from '../shared-funds/components/no-apikeys-modal/no-apikeys-modal.component';

@Component({
  selector: 'app-fund-investment',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/fund-name"></ion-back-button>
        </ion-buttons>
        <ion-title>{{
          (this.fundRenew ? 'funds.fund_investment.header_renew' : 'funds.fund_investment.header') | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding fi">
      <div class="fi__info">
        <div>
          <ion-text class="ux-font-text-lg" color="uxdark">{{
            'funds.fund_investment.header_info.title' | translate
          }}</ion-text>
        </div>
        <div class="fi__info__description">
          <ion-text class="ux-font-text-xs" color="uxdark">{{
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
  readOnly: boolean;
  apikeys: any = [];

  constructor(
    public submitButtonService: SubmitButtonService,
    private fundDataStorage: FundDataStorageService,
    private navController: NavController,
    private apiApiKeysService: ApiApikeysService,
    private modalController: ModalController,
    private storageApiKeysService: StorageApikeysService,
    private alertController: AlertController,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.readOnly = this.route.snapshot.paramMap.has('show');
    await this.getFundRenewData();
    this.getAllApiKeys();
  }

  async getFundRenewData() {
    this.fundRenew = await this.fundDataStorage.getData('fundRenew');
    this.fundName = await this.fundDataStorage.getData('fundName');
  }

  getAllApiKeys() {
    this.apiApiKeysService.getAll().subscribe((data) => {
      this.apikeys = data;
    });
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
          handler: () => this.navController.navigateForward(['/fiat-ramps/select-provider']),
        },
      ],
    });
    await alert.present();
  }

  saveProfileAndCurrency(data: any) {
    this.fundDataStorage.setData('fundRiskLevel', { risk_level: data.risk_level });
    this.fundDataStorage.setData('fundCurrency', { currency: data.currency });
  }

  async handleSubmit(data: any) {
    if (this.apikeys.length === 0) {
      this.openModal();
      return;
    }
    this.readOnly ? this.navController.navigateForward('/apikeys/list') : this.handleCreation(data);
  }

  async handleCreation(data: any) {
    const response = await this.checkMinBalance(data.risk_level);
    if (response.balance_is_enough) {
      this.saveProfileAndCurrency(data);
      this.navController.navigateForward(['funds/fund-take-profit']);
    } else {
      await this.showNotEnoughBalanceAlert(response.min_balance);
    }
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: NoApikeysModalComponent,
      cssClass: 'ux-modal-no-apikeys',
      swipeToClose: false,
    });
    await modal.present();
  }
}
