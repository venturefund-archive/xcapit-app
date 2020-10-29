import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../../../shared-funds/services/api-funds/api-funds.service';
import { Currency } from '../../../shared-funds/enums/currency.enum';

@Component({
  selector: 'app-fund-list-sub-header',
  template: `
      <div class="fl__total">
          <div class="ux-font-lato ux-fweight-regular ux-fsize-14">
              <ion-text>
                  {{ 'funds.funds_list.sub_header.total_title' | translate }}
              </ion-text>
          </div>
          <div *ngIf="totalBalanceBTC?.start_balance === 0"
               class="fl__total__amount ux-font-lato ux-fweight-regular ux-fsize-14">
              <ion-text>
                  {{ 'funds.funds_list.sub_header.not_balance_found' | translate }}
              </ion-text>
          </div>
          <div *ngIf="totalBalanceBTC?.start_balance != 0"
               class="fl__total__amount__btcValue ux-font-gilroy ux-fweight-extrabold ux-fsize-40"
          >
              <app-ux-loading-block
                      *ngIf="!totalBalanceBTC"
                      minSize="25px"
              ></app-ux-loading-block>
              <ion-text>
                  {{ this.totalBalanceBTC?.total_balance | number: '1.2-6' }}
                  {{ this.totalBalanceBTC?.currency }}
              </ion-text>
          </div>
          <div class="fl__total__amount" *ngIf="totalBalanceUSDT?.start_balance != 0">
              <div
                      class="fl__total__amount ux-font-gilroy ux-fweight-extrabold ux-fweight-regular ux-fsize-17"
              >
              <app-ux-loading-block
                      *ngIf="!totalBalanceUSDT"
                      minSize="15px"
              ></app-ux-loading-block>
              <ion-text *ngIf="totalBalanceUSDT">
                  ≈
                  {{ this.totalBalanceUSDT?.total_balance | number: '1.2-6' }}
                  {{ this.totalBalanceUSDT?.currency }}
              </ion-text>
              </div>
          </div>
          <div class="fl__total__detail" *ngIf="totalBalanceBTC?.start_balance != 0">
              <ion-badge class="ux-font-gilroy ux-fweight-extrabold ux-fsize-10">
                  <ion-icon
                          name="ux-triangle-up"
                          *ngIf="this.totalBalanceBTC?.profit > 0"
                  ></ion-icon>
                  <ion-icon
                          name="ux-triangle-down"
                          *ngIf="this.totalBalanceBTC?.profit < 0"
                  ></ion-icon>
                  {{
                  this.totalBalanceBTC?.profit | absoluteValue | number: '1.2-2'
                  }}
                  %
              </ion-badge>
              <div
                      class="fl__total__detail__text ux-font-lato ux-fweight-regular ux-fsize-12"
              >
                  <ion-text>
                      {{ 'funds.funds_list.sub_header.total_detail' | translate }}
                  </ion-text>
              </div>
          </div>
      </div>
  `,
  styleUrls: ['./fund-list-sub-header.component.scss']
})
export class FundListSubHeaderComponent implements OnInit {
  totalBalanceBTC: any;
  totalBalanceUSDT: any;
  currencies = [Currency.BTC, Currency.USDT];

  constructor(
    private apiFunds: ApiFundsService
  ) {
  }

  ngOnInit() {
    this.getTotalBalance('BTC');
    this.getTotalBalance('USDT');
  }

  getTotalBalance(ca: string) {
    this.apiFunds
      .getTotalBalance(ca, false)
      .subscribe((data: any) => {
        if(ca == 'BTC'){
        this.totalBalanceBTC = data;
      }
      else{
        this.totalBalanceUSDT = data;
      }
      });
  }
}
