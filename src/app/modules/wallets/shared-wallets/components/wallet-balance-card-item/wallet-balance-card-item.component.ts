import { Component, Input, OnInit } from '@angular/core';
import { AssetBalance } from '../../interfaces/asset-balance.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet-balance-card-item',
  template: `
    <div id="balance-card" (click)="this.goToAssetDetail()">
      <div class="wbci ion-padding">
        <div>
          <ion-img class="wbci__img" [src]="this.balance.icon"></ion-img>
        </div>
        <div class="wbci__content">
          <div class="wbci__content__top">
            <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-bold">{{ this.balance.symbol }}</ion-label>
            <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-semibold"
              >{{ this.balance.amount | number: '1.2-6' }} {{ this.balance.symbol }}</ion-label
            >
          </div>
          <div class="wbci__content__bottom">
            <ion-label color="uxmedium" class="ux-font-lato ux-fsize-12 ux-fweight-regular">{{
              this.balance.name
            }}</ion-label>
            <ion-label *ngIf="this.hasPrice()" color="uxmedium" class="ux-font-lato ux-fsize-12 ux-fweight-regular">
              {{ this.balance.usdAmount | number: '1.2-2' }} {{ this.balance.usdSymbol }}
            </ion-label>
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

  constructor(private navController: NavController) {}

  ngOnInit() {}

  hasPrice() {
    return this.balance.usdAmount !== undefined && !(this.balance.amount > 0 && this.balance.usdAmount === 0);
  }

  goToAssetDetail() {
    this.navController.navigateForward(['wallets/asset-detail/' + this.balance.symbol]);
  }
}
