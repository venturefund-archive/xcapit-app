import { Component, OnInit, Input } from '@angular/core';
import { UxSelectModalComponent } from 'src/app/shared/components/ux-select-modal/ux-select-modal.component';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from '../../enums/currency.enum';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { FundBalanceDetailComponent } from '../fund-balance-detail/fund-balance-detail.component';

@Component({
  selector: 'app-fund-portfolio-card',
  template: `
    <div class="fpc">
      <div class="fpc__content ion-padding">
        <div class="fpc__content__left">
          <app-fund-balance-chart
            [fundBalance]="this.orderedPortfolio"
            [currency]="this.currency"
          ></app-fund-balance-chart>
        </div>
        <div class="fpc__content__right">
          <div class="by-currency" *ngIf="this.orderedPortfolio">
            <div
              class="by-currency__item"
              *ngFor="let p of this.orderedPortfolio | slice: 0:3"
            >
              <div class="by-currency__item__left">
                <div class="color" [style.background-color]="p.color"></div>
                <ion-text
                  class="text ux-font-lato ux-fweight-semibold ux-fsize-14"
                  color="uxdark"
                  >{{ p.ca }}
                </ion-text>
              </div>
              <div>
                <ion-text
                  class="ux-font-lato ux-fweight-semibold ux-fsize-14"
                  color="uxdark"
                  >{{ p.percentage | number: '1.0-2' }} %</ion-text
                >
              </div>
            </div>
          </div>
          <div class="base" style="float:left">
            <ion-text
              class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24"
              color="uxdark"
            >
              {{
                this.totalBTC
                  | currencyFormat
                    : {
                        currency: "BTC ",
                        formatBTC: '1.2-6'
                      }
              }}
            </ion-text>
          </div>
          <div class="base">
            <ion-text
              class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24"
              color="uxdark"
            >
            &nbsp;≈
              {{
                this.totalUSDT
                  | currencyFormat
                    : {
                        currency: "USDT",
                        formatUSDT: '1.2-2'
                      }
              }}
            </ion-text>
          </div>
        </div>
      </div>
      <div class="fpc__footer">
        <ion-button
          appTrackClick
          name="View Details"
          (click)="this.viewDetails()"
          fill="clear"
          size="small"
          class="fpc__footer__details-button ux-font-lato ux-fweight-semibold ux-fsize-14"
        >
          {{ 'funds.fund_detail.fund_portfolio_card.view_detail' | translate }}
          <ion-icon slot="end" name="ux-forward"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./fund-portfolio-card.component.scss'],
})
export class FundPortfolioCardComponent implements OnInit {
  @Input() fundBalance: any;
  orderedPortfolio: Array<{
    ca: string;
    amount: number;
    value: number;
    percentage: number;
    color: string;
  }>;
  currency: string;
  totalBTC: number;
  totalUSDT: number;

  currencies = [Currency.BTC, Currency.USDT];

  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private apiFunds: ApiFundsService
  ) {}

  ngOnInit() {
    this.orderChartData();
    this.setTotals();
    this.setCurrency();
  }

  setTotals() {
    this.totalBTC = this.fundBalance.balance.end_balance;
    this.totalUSDT = this.fundBalance.balance.to_ca.end_balance;
  }

  setCurrency() {
    this.currency = this.fundBalance.fund.currency;
  }

  orderChartData() {
    this.orderedPortfolio = this.fundBalance.balance.summary.sort(
      (a: any, b: any) =>
        a.percentage < b.percentage ? 1 : a.percentage > b.percentage ? -1 : 0
    );
  }

  async viewDetails() {
    const modal = await this.modalController.create({
      component: FundBalanceDetailComponent,
      componentProps: {
        orderedPortfolio: this.orderedPortfolio,
        startDate: this.fundBalance.balance.start_time,
        endDate: this.fundBalance.balance.end_time,
        currency: this.fundBalance.fund.currency,
      },
      swipeToClose: false,
      cssClass: 'ux-routeroutlet-modal',
    });

    await modal.present();
  }
}
