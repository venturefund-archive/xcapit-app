import { Component, Input, OnInit } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-wallet-transaction-card-item',
  template: `
    <div>
      <div class="wtci ion-padding">
        <div>
          <ion-img class="wtci__img" [src]="this.transaction.icon"></ion-img>
        </div>
        <div class="wtci__content">
          <div class="wtci__content__top">
            <div class="wtci__content__top__type_date_hash">
              <div class="wtci__content__top__type_date_hash__type_date">
                <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-bold">{{
                  'wallets.transactions.' + this.transaction.type | translate
                }}</ion-label>
                <ion-label class="ux-font-text-xxs date">
                  {{ this.formattedDate}}
                </ion-label>
              </div>
              <div class="wtci__content__top__type_date_hash__hash">
                <ion-text class="ux-font-text-xs">
                  {{ this.transaction.hash }}
                </ion-text>
              </div>
            </div>
            <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-semibold">
              {{ this.transaction.amount | number: '1.2-6' }} {{ this.transaction.symbol }}
            </ion-label>
          </div>
        </div>
      </div>
      <div *ngIf="!this.last" class="list-divider"></div>
    </div>
  `,
  styleUrls: ['./wallet-transaction-card-item.component.scss'],
})
export class WalletTransactionCardItemComponent implements OnInit {
  @Input() transaction;
  @Input() last: boolean;
  formattedDate

  constructor() {}

  ngOnInit() {
    this.formattedDate = this.formatDate(this.transaction.date)
  }
  formatDate(value) {
  return format(parseISO(value), 'dd-MM-yyyy');
  }
}
