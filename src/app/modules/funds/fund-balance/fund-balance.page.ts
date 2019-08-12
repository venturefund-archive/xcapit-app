import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { LogsService } from 'src/app/shared/services/logs/logs.service';

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
              {{ this.fundBalance.fund.currency }}:
              {{ this.fundBalance | currencyEndBalance | number: '1.2-4' }}
            </h2>
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

  fundBalance: any;

  defaultBackRoute = '/funds/list';

  constructor(
    private route: ActivatedRoute,
    private apiFunds: ApiFundsService,
    private logsService: LogsService
  ) {}

  ngOnInit() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.setDefaultBackRoute();
  }

  ionViewDidEnter() {
    this.logsService
      .log(`{"message": "Has entered fund-balance of fund: ${this.fundName}"}`)
      .subscribe();
    this.getFundBalance();
  }

  getFundBalance() {
    this.apiFunds.getBalance(this.fundName).subscribe(res => {
      this.logsService
        .log(
          `{"message": "Has requested fund balance of fund: ${this.fundName}"}`
        )
        .subscribe();
      this.fundBalance = res;
      this.loadingBalance = false;
    });
  }

  private setDefaultBackRoute() {
    this.defaultBackRoute = this.fundName ?
      `/funds/fund-summary/${this.fundName}` : this.defaultBackRoute;
  }
}
