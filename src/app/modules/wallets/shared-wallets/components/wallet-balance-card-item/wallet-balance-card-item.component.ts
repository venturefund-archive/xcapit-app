import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NETWORK_COLORS } from '../../constants/network-colors.constant';
import { TokenDetail2 } from '../../models/token-detail-2/token-detail-2';

@Component({
  selector: 'app-wallet-balance-card-item',
  template: `
    <div class="wbci ion-padding" (click)="this.goToAssetDetail()">
      <div><img class="wbci__img" [src]="this.tokenDetail.coin.logoRoute" alt="Asset icon" /></div>
      <div class="wbci__content">
        <div class="wbci__content__top">
          <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-bold wbci__content__top__name-label"
            >{{ this.tokenDetail.coin.value }}
            <ion-badge
              [color]="this.networkColors[this.tokenDetail.coin.network]"
              class="ux-badge ux-font-num-subtitulo"
              >{{ this.tokenDetail.coin.network | formattedNetwork | uppercase }}</ion-badge
            >
          </ion-label>
          <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-semibold"
            >{{ this.tokenDetail.balance | number: '1.2-6' }} {{ this.tokenDetail.coin.value }}</ion-label
          >
        </div>
        <div class="wbci__content__bottom">
          <ion-label color="neutral50" class="ux-font-lato ux-fsize-12 ux-fweight-regular"
            >{{ this.tokenDetail.coin.name }}
          </ion-label>
          <ion-label color="neutral50" class="ux-font-lato ux-fsize-12 ux-fweight-regular">
            {{ this.tokenDetail.price * this.tokenDetail.balance | number: '1.2-2' }}
            {{ this.tokenDetail.quoteSymbol }}
          </ion-label>
        </div>
      </div>
    </div>
    <div *ngIf="!this.last" class="list-divider"></div>
  `,
  styleUrls: ['./wallet-balance-card-item.component.scss'],
})
export class WalletBalanceCardItemComponent implements OnInit {
  @Input() tokenDetail: TokenDetail2;
  @Input() last: boolean;
  networkColors = NETWORK_COLORS;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToAssetDetail() {
    this.navController.navigateForward(['wallets/asset-detail/', this.tokenDetail.coin.value]);
  }
}
