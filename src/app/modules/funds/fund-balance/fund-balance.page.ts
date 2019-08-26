import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { CA } from '../shared-funds/enums/ca.enum';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-fund-balance',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            [defaultHref]="this.defaultBackRoute"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'funds.fund_balance.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <div class="fb" *ngIf="this.fundBalance?.fund?.id_corrida">
        <div class="fb__header">
          <h1>
            {{
              'funds.fund_balance.main_title'
                | translate
                  : {
                      fundName: this.fundName,
                      period: this.fundBalance?.fund?.id_corrida
                    }
            }}
          </h1>
        </div>
        <div class="fb__content">
          <div class="fb__content__total ion-text-center ion-padding-bottom">
            <h2>
              {{ 'funds.fund_balance.balance_total' | translate }}
              {{
                (this.fundBalance.balance.to_ca
                  ? this.fundBalance.balance.to_ca.ca
                  : this.fundBalance.fund.currency) | uppercase
              }}:
              {{ this.fundBalance | currencyEndBalance | number: '1.2-4' }}
            </h2>
            <ion-button
              *ngIf="!this.changingCa"
              appTrackClick
              name="ChanginCa"
              size="small"
              (click)="this.changingCa = true"
            >
              <ion-icon slot="start" name="create"></ion-icon>
              {{ 'funds.fund_balance.change_ca' | translate }}
            </ion-button>

            <ion-grid *ngIf="this.changingCa">
              <form
                [formGroup]="this.form"
                (ngSubmit)="this.changeFundCA()"
                style="width:100%;"
              >
                <ion-row align-items-end>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">
                        {{ 'funds.fund_summary.change_fund_ca' | translate }}
                      </ion-label>
                      <ion-select formControlName="ca">
                        <ion-select-option
                          [value]="this.CAEnum.BTC"
                          [disabled]="this.toCa === this.CAEnum.BTC"
                        >
                          {{ this.CAEnum.BTC }}
                        </ion-select-option>
                        <ion-select-option
                          [value]="this.CAEnum.USDT"
                          [disabled]="this.toCa === this.CAEnum.USDT"
                        >
                          {{ this.CAEnum.USDT }}
                        </ion-select-option>
                        <ion-select-option
                          [value]="this.CAEnum.BNB"
                          [disabled]="this.toCa === this.CAEnum.BNB"
                        >
                          {{ this.CAEnum.BNB }}
                        </ion-select-option>
                        <ion-select-option
                          [value]="this.CAEnum.ETH"
                          [disabled]="this.toCa === this.CAEnum.ETH"
                        >
                          {{ this.CAEnum.ETH }}
                        </ion-select-option>
                        <ion-select-option
                          [value]="this.CAEnum.LTC"
                          [disabled]="this.toCa === this.CAEnum.LTC"
                        >
                          {{ this.CAEnum.LTC }}
                        </ion-select-option>
                      </ion-select>
                    </ion-item>
                  </ion-col>
                  <ion-col>
                    <ion-button
                      appTrackClick
                      name="Change Fund CA"
                      expand="block"
                      size="medium"
                      type="submit"
                      color="primary"
                      [disabled]="!this.form.valid"
                    >
                      <ion-icon slot="start" name="checkmark"></ion-icon>
                      {{
                        'funds.fund_summary.change_fund_ca_button' | translate
                      }}
                    </ion-button></ion-col
                  >
                </ion-row>
              </form>
            </ion-grid>
          </div>
          <app-fund-balance-chart
            [fundBalance]="this.fundBalance?.balance"
          ></app-fund-balance-chart>

          <div
            class="fb__content__balance_table ion-padding-top ion-margin-top"
          >
            <ion-list>
              <ion-item-divider>
                {{ 'funds.fund_balance.balance_table_title' | translate }}
              </ion-item-divider>
              <ion-grid class="fb__content__balance_table__content">
                <ion-row class="ion-align-items-center">
                  <ion-col size="6">
                    BTC:
                  </ion-col>
                  <ion-col>
                    <app-currency-amount-value
                      [currency]="this.fundBalance.fund.currency"
                      [amount]="this.fundBalance.balance.cant_btc"
                      [usdValue]="this.fundBalance.balance.btc_usd"
                      [btcValue]="this.fundBalance.balance.cant_btc"
                    ></app-currency-amount-value>
                  </ion-col>
                </ion-row>
                <ion-row class="ion-align-items-center">
                  <ion-col size="6">ETH:</ion-col>
                  <ion-col>
                    <app-currency-amount-value
                      [currency]="this.fundBalance.fund.currency"
                      [amount]="this.fundBalance.balance.cant_eth"
                      [usdValue]="this.fundBalance.balance.eth_usd"
                      [btcValue]="this.fundBalance.balance.eth_btc"
                    ></app-currency-amount-value>
                  </ion-col>
                </ion-row>
                <ion-row class="ion-align-items-center">
                  <ion-col size="6">LTC:</ion-col>
                  <ion-col>
                    <app-currency-amount-value
                      [currency]="this.fundBalance.fund.currency"
                      [amount]="this.fundBalance.balance.cant_ltc"
                      [usdValue]="this.fundBalance.balance.ltc_usd"
                      [btcValue]="this.fundBalance.balance.ltc_btc"
                    ></app-currency-amount-value>
                  </ion-col>
                </ion-row>
                <ion-row class="ion-align-items-center">
                  <ion-col size="6">BNB:</ion-col>
                  <ion-col>
                    <app-currency-amount-value
                      [currency]="this.fundBalance.fund.currency"
                      [amount]="this.fundBalance.balance.cant_bnb"
                      [usdValue]="this.fundBalance.balance.bnb_usd"
                      [btcValue]="this.fundBalance.balance.bnb_btc"
                    ></app-currency-amount-value>
                  </ion-col>
                </ion-row>
                <ion-row class="ion-align-items-center">
                  <ion-col size="6">USD:</ion-col>
                  <ion-col>
                    <app-currency-amount-value
                      [currency]="this.fundBalance.fund.currency"
                      [amount]="this.fundBalance.balance.cant_usdt"
                      [usdValue]="this.fundBalance.balance.cant_usdt"
                      [btcValue]="this.fundBalance.balance.usd_btc"
                    ></app-currency-amount-value>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <ion-item-divider class="custom_divider"></ion-item-divider>
            </ion-list>
          </div>
          <div class="fb__content__date_info ion-text-center ion-padding-top">
            {{ 'funds.fund_balance.date_info_start_period_text' | translate }}
            {{ this.fundBalance?.balance?.fecha_inicio | date: 'dd/MM/yyyy' }}
            {{ ' - ' }}
            {{ 'funds.fund_balance.date_info_last_update_text' | translate }}
            {{ this.fundBalance?.balance?.fecha_fin | date: 'dd/MM/yyyy' }}
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-balance.page.scss']
})
export class FundBalancePage implements OnInit {
  fundName: string;

  loadingBalance = true;
  changingCa = false;

  fundBalance: any;

  defaultBackRoute = '/funds/list';
  toCa: string;
  CAEnum = CA;
  form: FormGroup = this.formBuilder.group({
    ca: ['', [Validators.required]]
  });
  constructor(
    private route: ActivatedRoute,
    private apiFunds: ApiFundsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.setDefaultBackRoute();
  }

  ionViewDidEnter() {
    this.getFundBalance();
  }

  getFundBalance() {
    this.apiFunds.getBalance(this.fundName, this.toCa).subscribe(res => {
      this.fundBalance = res;
      this.loadingBalance = false;
    });
  }

  changeFundCA() {
    if (this.form.valid) {
      this.toCa = this.form.value.ca;
      this.getFundBalance();
      this.changingCa = false;
    }
  }

  private setDefaultBackRoute() {
    this.defaultBackRoute = this.fundName
      ? `/funds/fund-summary/${this.fundName}`
      : this.defaultBackRoute;
  }
}
