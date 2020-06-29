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
          <div class="base">
            <ion-text
              class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24"
              color="uxdark"
              >{{ this.total | number: '1.0-2' }} {{ this.currency }}</ion-text
            >
            <ion-button
              appTrackClick
              name="Change Currency"
              (click)="this.changeCurrency()"
              fill="clear"
              size="small"
              class="change-currency"
              [disabled]="!this.currency"
            >
              <ion-icon
                slot="icon-only"
                name="ux-pencil"
                color="uxmedium"
              ></ion-icon>
            </ion-button>
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
  styleUrls: ['./fund-portfolio-card.component.scss']
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
  total: number;

  currencies = [Currency.BTC, Currency.USDT];

  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private apiFunds: ApiFundsService
  ) {}

  ngOnInit() {
    this.orderChartData();
    this.setTotal();
    this.setCurrency();
  }

  setTotal() {
    this.total = this.fundBalance.balance.end_balance;
  }

  setCurrency() {
    this.currency = this.fundBalance.fund.currency;
  }

  orderChartData() {
    this.orderedPortfolio = this.fundBalance.balance.summary.sort((a: any, b: any) =>
      a.percentage < b.percentage ? 1 : a.percentage > b.percentage ? -1 : 0
    );
  }

  async changeCurrency() {
    const modal = await this.modalController.create({
      component: UxSelectModalComponent,
      componentProps: {
        title: this.translate.instant(
          'funds.fund_detail.fund_portfolio_card.change_currency'
        ),
        data: this.currencies,
        selected: this.currency
      },
      swipeToClose: false,
      cssClass: 'ux-routeroutlet-modal'
    });

    await modal.present();

    const data = await modal.onDidDismiss();

    if (data.role === 'selected') {
      this.getBalanceInCa(data.data);
    }
  }

  getBalanceInCa(ca: string) {
    this.apiFunds.getBalance(this.fundBalance.fund.nombre_bot, ca, false).subscribe(data => {
      this.total = data.balance.to_ca.end_balance;
      this.currency = ca;
    });
  }

  async viewDetails() {
    const modal = await this.modalController.create({
      component: FundBalanceDetailComponent,
      componentProps: {
        orderedPortfolio: this.orderedPortfolio,
        startDate: this.fundBalance.balance.start_date,
        endDate: this.fundBalance.balance.end_date,
        currency: this.fundBalance.fund.currency
      },
      swipeToClose: false,
      cssClass: 'ux-routeroutlet-modal'
    });

    await modal.present();
  }
}
