import { Component, Input } from '@angular/core';
import { NETWORK_COLORS } from 'src/app/modules/wallets/shared-wallets/constants/network-colors.constant';

@Component({
  selector: 'app-coin-content-item',
  template: ` <div class="cci__item">
    <div class="cci__item__container">
      <div class="cci__item__container__title_and_image">
        <div class="cci__item__container__title_and_image__image_container">
          <img [src]="this.flagRoute" alt="Product Image" />
        </div>
        <div class="cci__item__container__title_container">
          <div class="cci__item__container__title_container__title">
            <ion-text class="ux-font-text-lg">{{ this.fiatCurrency | uppercase }}</ion-text>
          </div>
          <div class="cci__item__container__title_container__badge">
            <ion-badge [color]="this.networkColors[this.network]" class="ux-badge ux-font-num-subtitulo">{{
              this.network | formattedNetwork | uppercase
            }}</ion-badge>
          </div>
        </div>
      </div>
      <div class="cci__item__container__amount">
        <div class="cci__item__container__amount__base">
          <ion-text class="ux-font-text-lg">{{ this.amount | formattedAmount }}</ion-text>
        </div>
        <div class="cci__item__container__amount__conversion">
          <ion-text class="ux-font-text-xs"> = {{ this.quoteAmount }} {{ this.token }} </ion-text>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./coin-content-item.component.scss'],
})
export class CoinContentItemComponent {
  @Input() flagRoute: string;
  @Input() fiatCurrency: string;
  @Input() token: string;
  @Input() network: string;
  @Input() amount: number;
  @Input() quoteAmount: number;
  networkColors = NETWORK_COLORS;

  constructor() {}

}
