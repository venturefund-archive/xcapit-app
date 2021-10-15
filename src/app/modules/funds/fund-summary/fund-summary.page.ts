import { Component, OnInit } from '@angular/core';
import { StorageApikeysService } from '../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from '../../../shared/services/submit-button/submit-button.service';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';

@Component({
  selector: 'app-fund-summary',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/fund-stop-loss"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'funds.fund_summary.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding-start ion-padding-end fs">
      <div class="ux_main" *ngIf="this.fund">
        <div class="ux_content">
          <div class="fs__title">
            <ion-text class="ux-font-text-lg"
              >{{ 'funds.fund_summary.title' | translate }}{{ this.fund.fund_name }}</ion-text
            >
          </div>

          <div class="fs__amount" *ngIf="this.accountBalance">
            <ion-text class="ux-font-num-titulo"
              >$
              {{
                this.accountBalance.account_balance
                  | currencyFormat: { currency: this.accountBalance.currency, formatBTC: '1.2-7', formatUSDT: '1.2-2' }
              }}</ion-text
            >
          </div>

          <div class="fs__strategy">
            <ion-text class="ux-font-text-xs"
              >{{ 'funds.fund_summary.strategy' | translate }}{{ this.fund.risk_level | strategyName }}</ion-text
            >
          </div>

          <div class="fs__tp-sl" *ngIf="this.fund">
            <app-stop-loss-take-profit-summary
              [stopLoss]="this.fund.trailing_stop ? this.fund.trailing_stop : this.fund.stop_loss"
              [takeProfit]="this.fund.take_profit"
              [isTrailing]="!!this.fund.trailing_stop"
            ></app-stop-loss-take-profit-summary>
          </div>
        </div>
        <div class="ux_footer">
          <div class="fs__buttons">
            <ion-button
              class="ux_button ux-font-button"
              appTrackClick
              name="Create Fund"
              type="submit"
              color="uxsecondary"
              size="large"
              (click)="this.handleSubmit()"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ this.opTypeLabels.submitButton[this.opType] | translate }}
            </ion-button>
            <ion-button
              appTrackClick
              name="Skip Invest"
              class="ux_button ux-font-button"
              fill="clear"
              size="small"
              (click)="this.skipInvest()"
            >
              {{ 'funds.fund_summary.skip_invest' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-summary.page.scss'],
})
export class FundSummaryPage implements OnInit {
  opType: string;
  fund: {
    stop_loss: number;
    take_profit: number;
    currency: string;
    risk_level: string;
    fund_name: string;
    trailing_stop?: number;
  };
  opTypeLabels = {
    submitButton: {
      renew: 'funds.fund_summary.submit_button_renew',
      new: 'funds.fund_summary.submit_button',
      edit: 'funds.fund_summary.submit_button_edit',
    },
  };
  stopLossTitle: string;
  stopLoss: string;
  takeProfit: string;

  stopLossTypes = {
    trailing: {
      title: '',
      value: '',
    },
  };

  accountBalance: { account_balance: number; currency: string };

  constructor(
    private fundDataStorage: FundDataStorageService,
    private storageApiKeysService: StorageApikeysService,
    private apiFundsService: ApiFundsService,
    private navController: NavController,
    private apiApiKeysService: ApiApikeysService,
    public submitButtonService: SubmitButtonService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getFund();
    this.getMode();
    this.getAccountBalance();
  }

  private getAccountBalance() {
    this.apiApiKeysService
      .getAccountBalance({ api_key_id: this.storageApiKeysService.data.id })
      .subscribe((res) => (this.accountBalance = res));
  }

  getMode() {
    this.fundDataStorage.getData('fundRenew').then((data) => {
      this.opType = data ? 'renew' : 'new';
    });
  }

  getFund() {
    this.fundDataStorage.getFund().then((res: any) => {
      this.fund = res;
    });
  }

  addApiKeyToFund(fund: any) {
    fund.api_key_id = this.storageApiKeysService.data.id;
    return fund;
  }

  handleSubmit() {
    if (this.opType === 'renew') {
      this.apiFundsService.renewFund(this.fund).subscribe(() => this.success());
    } else {
      this.fund = this.addApiKeyToFund(this.fund);
      this.apiFundsService.crud.create(this.fund).subscribe(
        () => this.success(),
        (e) => this.error(e)
      );
    }
  }

  private success() {
    this.fundDataStorage.clearAll();
    this.navController
      .navigateForward(['/funds/fund-success', this.opType === 'renew'], {
        replaceUrl: true,
      })
      .then();
  }

  private error(e) {
    if (e.error.error_code === 'funds.create.fundNameExists') {
      this.navController.navigateBack('/funds/fund-name').then();
    }
  }

  async skipInvest() {
    await this.navController.navigateRoot('/tabs/home');
  }
}
