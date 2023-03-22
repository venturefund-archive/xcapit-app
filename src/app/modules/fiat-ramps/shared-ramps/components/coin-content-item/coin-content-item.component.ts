import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coin-content-item',
  template: `    <div class="cci__item">
  <div class="cci__item__container">
    <div class="cci__item__container__title_and_image">
      <div class="cci__item__container__title_and_image__image_container">
        <img [src]="this.token.logoRoute" alt="Product Image" />
      </div>
      <div class="cci__item__container__title_container">
        <div class="cci__item__container__title_container__title">
          <ion-text class="ux-font-text-lg">{{ this.token.value }}</ion-text>
        </div>
        <div class="cci__item__container__title_container__badge">
          <ion-badge
            [color]="this.networkColors[this.token.network]"
            class="ux-badge ux-font-num-subtitulo"
            >{{ this.token.network | formattedNetwork | uppercase }}</ion-badge
          >
        </div>
      </div>
    </div>
    <div class="cci__item__container__amount">
      <div>
        <ion-text class="ux-font-text-lg"
          >{{ this.warrantyData.amount | formattedAmount }}
          {{ this.token.value | titlecase | uppercase }}</ion-text
        >
      </div>
      <div class="cci__item__container__amount__conversion">
        <ion-text class="ux-font-text-xs">
          = {{ this.warrantyData.quoteAmount }} USD
        </ion-text>
      </div>
    </div>
  </div>
  <div class="list-divider"></div>
</div>`,
  styleUrls: ['./coin-content-item.component.scss'],
})
export class CoinContentItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
