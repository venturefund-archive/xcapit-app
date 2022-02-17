import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AssetBalanceModel } from '../../models/asset-balance/asset-balance.class';
import { NETWORK_COLORS } from '../../constants/network-colors.constant';

@Component({
  selector: 'app-wallet-balance-card-item',
  template: `
    <div class="wbci ion-padding" (click)="this.goToAssetDetail()">
      <div><img class="wbci__img" [src]="this.balance.icon" alt="Asset icon" /></div>
      <div class="wbci__content">
        <div class="wbci__content__top">
          <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-bold wbci__content__top__name-label"
            >{{ this.balance.symbol }}
            <ion-badge [color]="this.networkColors[this.balance.network]" class="ux-badge ux-font-num-subtitulo">{{
              this.balance.network | formattedNetwork | uppercase
            }}</ion-badge>
          </ion-label>
          <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-semibold"
            >{{ this.balance.amount | number: '1.2-6' }} {{ this.balance.symbol }}</ion-label
          >
        </div>
        <div class="wbci__content__bottom">
          <ion-label color="uxmedium" class="ux-font-lato ux-fsize-12 ux-fweight-regular"
            >{{ this.balance.name }}
          </ion-label>
          <ion-label color="uxmedium" class="ux-font-lato ux-fsize-12 ux-fweight-regular">
            {{ this.balance.price * this.balance.amount | number: '1.2-2' }}
            {{ this.balance.quoteSymbol }}
          </ion-label>
        </div>
      </div>
    </div>
    <div *ngIf="!this.last" class="list-divider"></div>
  `,
  styleUrls: ['./wallet-balance-card-item.component.scss'],
})
export class WalletBalanceCardItemComponent implements OnInit {
  @Input() balance: AssetBalanceModel;
  @Input() last: boolean;
  networkColors = NETWORK_COLORS;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToAssetDetail() {
    this.navController.navigateForward(['wallets/asset-detail/', this.balance.symbol]);
  }
}
