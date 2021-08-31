import { Component, Input, OnInit } from '@angular/core';
import { AssetBalance } from '../../interfaces/asset-balance.interface';

@Component({
  selector: 'app-wallet-balance-card-item',
  template: `
    <div>
      <div class="wbci ion-padding">
        <div>
          <ion-img class="wbci__img" [src]="this.balance.icon"></ion-img>
        </div>
        <div class="wbci__content">
          <div class="wbci__content__top">
            <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-bold">{{ this.balance.symbol }}</ion-label>
            <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-semibold"
              >{{ this.balance.amount }} {{ this.balance.symbol }}</ion-label
            >
          </div>
          <div class="wbci__content__bottom">
            <ion-label color="uxmedium" class="ux-font-lato ux-fsize-12 ux-fweight-regular">{{
              this.balance.name
            }}</ion-label>
          </div>
        </div>
      </div>
      <div *ngIf="!this.last" class="list-divider"></div>
    </div>
  `,
  styleUrls: ['./wallet-balance-card-item.component.scss'],
})
export class WalletBalanceCardItemComponent implements OnInit {
  @Input() balance: AssetBalance;
  @Input() last: boolean;
  constructor() {}

  ngOnInit() {}
}
