import { Component, Input, OnInit } from '@angular/core';

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
            <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-bold">{{
              'wallets.transactions.' + this.transaction.type | translate
            }}</ion-label>
            <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-semibold" *ngIf="this.transaction.type !== 'swap'">
              {{ this.transaction.value }} {{ this.transaction.asset }}
            </ion-label>
            <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-semibold" *ngIf="this.transaction.type === 'swap'">
              {{ this.transaction.swap.amountIn }} {{ this.transaction.swap.currencyIn }}
            </ion-label>
          </div>
          <div class="wtci__content__bottom" *ngIf="this.transaction.type === 'swap'">
            <ion-label color="uxmedium" class="ux-font-lato ux-fsize-12 ux-fweight-regular">
              {{ this.transaction.swap.currencyOut }} -> {{ this.transaction.swap.currencyIn }}
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

  constructor() {}

  ngOnInit() {}
}
