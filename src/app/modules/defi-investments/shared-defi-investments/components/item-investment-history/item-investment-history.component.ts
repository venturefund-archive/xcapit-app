import { Component, Input, OnInit } from '@angular/core';
import { formatUnits } from 'ethers/lib/utils';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

@Component({
  selector: 'app-item-investment-history',
  template: `
    <div class="iih">
      <div class="iih__icon">
        <ion-icon name="ux-add-amount" *ngIf="movement.type === 'deposit'"></ion-icon>
        <ion-icon name="ux-withdraw" *ngIf="movement.type === 'withdraw'"></ion-icon>
      </div>
      <div class="iih__content">
        <div class="iih__content__type-date">
          <ion-text class="iih__content__type-date__type ux-font-titulo-xs" *ngIf="movement.type === 'deposit'">
            {{ 'defi_investments.invest_detail.history.investment' | translate }}
          </ion-text>
          <ion-text class="iih__content__type-date__type ux-font-titulo-xs" *ngIf="movement.type === 'withdraw'">
            {{ 'defi_investments.invest_detail.history.withdraw' | translate }}
          </ion-text>
          <ion-text class="iih__content__type-date__date ux-font-text-xxs" color="neutral50">
            {{ this.date }}
          </ion-text>
        </div>
        <div class="iih__content__amount">
          <ion-text class="iih__content__amount__amount ux-font-titulo-xs">
            {{ this.amount | formattedAmount }} {{ this.token?.value }}
          </ion-text>
        </div>
      </div>
    </div>
    <div *ngIf="!this.last" class="list-divider"></div>
  `,
  styleUrls: ['./item-investment-history.component.scss'],
})
export class ItemInvestmentHistoryComponent implements OnInit {
  @Input() movement;
  @Input() last: any;
  @Input() token: Coin;
  isReversed: boolean;
  date: string;
  amount: number;

  constructor() {}

  ngOnInit() {
    this.formattedDate();
    this.formattedAmount();
  }

  formattedDate() {
    this.date = new Date(this.movement.timestamp * 1000).toLocaleDateString().split('/').join('-');
  }

  formattedAmount() {
    this.amount = parseFloat(formatUnits(this.movement.amount, this.token.decimals));
  }
}
