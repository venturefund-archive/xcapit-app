import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';

@Component({
  selector: 'app-fund-balance',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'funds.fund_balance.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <div class="fb" *ngIf="this.fundBalance?.fund?.id_corrida">
        <div class="fb__header ion-padding-bottom">
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
                <ion-row>
                  <ion-col size="3">
                    BTC:
                  </ion-col>
                  <ion-col>
                    <app-currency-amount-value
                      [amount]="this.fundBalance.balance.cant_btc"
                      [value]="this.fundBalance.balance.btc_usd"
                    ></app-currency-amount-value>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="3">ETH:</ion-col>
                  <ion-col>
                    <app-currency-amount-value
                      [amount]="this.fundBalance.balance.cant_eth"
                      [value]="this.fundBalance.balance.eth_usd"
                    ></app-currency-amount-value>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="3">LTC:</ion-col>
                  <ion-col>
                    <app-currency-amount-value
                      [amount]="this.fundBalance.balance.cant_ltc"
                      [value]="this.fundBalance.balance.ltc_usd"
                    ></app-currency-amount-value>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="3">BNB:</ion-col>
                  <ion-col>
                    <app-currency-amount-value
                      [amount]="this.fundBalance.balance.cant_bnb"
                      [value]="this.fundBalance.balance.bnb_usd"
                    ></app-currency-amount-value>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="3">USD:</ion-col>
                  <ion-col>
                    <app-currency-amount-value
                      [amount]="this.fundBalance.balance.cant_usdt"
                    ></app-currency-amount-value>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <ion-item-divider class="custom_divider"></ion-item-divider>
            </ion-list>
          </div>

          <div class="fb__content__total ion-text-center">
            <h4>
              {{ 'funds.fund_balance.balance_total' | translate }}
              {{ this.fundBalance.fund.currency | currencyText }}:
              {{ this.fundBalance | currencyEndBalance | number: '1.2-4' }}
            </h4>
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

  constructor(
    private route: ActivatedRoute,
    private apiFunds: ApiFundsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.getFundBalance();
  }

  getFundBalance() {
    this.apiFunds.getBalance(this.fundName).subscribe(res => {
      this.fundBalance = res;
      this.loadingBalance = false;
    });
  }
}
