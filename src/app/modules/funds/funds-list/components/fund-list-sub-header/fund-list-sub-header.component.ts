import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../../../shared-funds/services/api-funds/api-funds.service';
import { Currency } from '../../../shared-funds/enums/currency.enum';
import { LocalStorageService } from '../../../../../shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-fund-list-sub-header',
  template: `
    <div class="fl__total">
      <div class="ux-font-text-xxs total-title">
        <ion-text>
          {{ 'funds.funds_list.sub_header.total_title' | translate }}
        </ion-text>
        <a class="type-toggle" (click)="this.hideText()">
          <ion-icon class="eye-button" [hidden]="!this.hideFundText" name="eye-off-outline"></ion-icon>
          <ion-icon class="eye-button" [hidden]="this.hideFundText" name="eye-outline"></ion-icon>
        </a>
      </div>

      <div *ngIf="totalBalanceBTC?.start_balance === 0" class="fl__total__amount ux-font-num-titulo">
        <ion-text class="">
          {{ 'funds.funds_list.sub_header.not_balance_found' | translate }}
        </ion-text>
      </div>
      <div *ngIf="totalBalanceBTC?.start_balance !== 0" class="fl__total__amount__btcValue ux-font-num-titulo">
        <app-ux-loading-block *ngIf="!totalBalanceBTC" minSize="25px"></app-ux-loading-block>
        <ion-text>
          {{ this.totalBalanceBTC?.total_balance | number: '1.2-6' | hideText: this.hideFundText }}
          {{ this.totalBalanceBTC?.currency }}
        </ion-text>
      </div>
      <div class="fl__total__amount" *ngIf="totalBalanceUSDT?.start_balance !== 0">
        <div class="fl__total__amount ux-font-num-subtitulo">
          <app-ux-loading-block *ngIf="!totalBalanceUSDT" minSize="15px"></app-ux-loading-block>
          <ion-text *ngIf="totalBalanceUSDT">
            ≈
            {{ this.totalBalanceUSDT?.total_balance | number: '1.2-6' | hideText: this.hideFundText }}
            {{ this.totalBalanceUSDT?.currency }}
          </ion-text>
        </div>
      </div>
      <div class="fl__total__detail" *ngIf="totalBalanceBTC?.start_balance !== 0">
        <ion-badge class="ux-font-text-xxs">
          <ion-icon name="ux-triangle-up" *ngIf="this.totalBalanceBTC?.profit > 0"></ion-icon>
          <ion-icon name="ux-triangle-down" *ngIf="this.totalBalanceBTC?.profit < 0"></ion-icon>
          {{ this.totalBalanceBTC?.profit | absoluteValue | number: '1.2-2' }}
          %
        </ion-badge>
        <div class="fl__total__detail__text ux-font-text-xxs">
          <ion-text>
            {{ 'funds.funds_list.sub_header.total_detail' | translate }}
          </ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./fund-list-sub-header.component.scss'],
})
export class FundListSubHeaderComponent implements OnInit {
  totalBalanceBTC: any;
  totalBalanceUSDT: any;
  currencies = [Currency.BTC, Currency.USDT];
  hideFundText: boolean;

  constructor(private apiFunds: ApiFundsService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.subscribeOnHideFunds();
    this.getTotalBalance('BTC');
    this.getTotalBalance('USDT');
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  getTotalBalance(ca: string) {
    this.apiFunds.getTotalBalance(ca, false).subscribe((data: any) => {
      if (ca === 'BTC') {
        this.totalBalanceBTC = data;
      } else {
        this.totalBalanceUSDT = data;
      }
    });
  }

  hideText() {
    this.localStorageService.toggleHideFunds();
  }
}
