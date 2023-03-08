import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-warranty-summary-card',
  template: ` <div class="wsc ion-padding ux-card">
    <div class="wsc__title">
      <ion-text class="ux-font-text-lg">
        {{ this.title }}
      </ion-text>
    </div>
    <div class="wsc__item">
      <app-asset-detail
        [blockchain]="this.token.network"
        [token]="this.token.value"
        [tokenLogo]="this.token.logoRoute"
      ></app-asset-detail>
      <div class="list-divider"></div>
    </div>
    <div class="wsc__item">
      <div class="wsc__item__title">
        <ion-text class="ux-font-titulo-xs">{{ this.documentTitle }}</ion-text>
      </div>
      <div class="wsc__item__content">
        <ion-text class="ux-font-text-base">{{ this.warrantyData?.document }}</ion-text>
      </div>
      <div class="list-divider"></div>
    </div>
    <div class="wsc__item">
      <div class="wsc__item__title">
        <ion-text class="ux-font-titulo-xs">{{ this.amountTitle }}</ion-text>
      </div>
      <div class="wsc__item__content">
        <ion-text class="ux-font-text-base"
          >{{ this.warrantyData.amount | formattedAmount }} {{ this.token.value }}</ion-text
        >
        <ion-text class="ux-font-text-base"
          >{{ this.warrantyData.quoteAmount | formattedAmount : 10 : 2 }} USD</ion-text
        >
      </div>
      <div class="list-divider"></div>
    </div>
    <div class="wsc__item">
      <div class="wsc__item__title">
        <ion-text class="ux-font-titulo-xs">{{ this.serviceCost }}</ion-text>
      </div>
      <div class="wsc__item__content">
        <ion-text class="ux-font-text-base">{{ this.warrantyData?.serviceCost }} {{ this.token.value }}</ion-text>
      </div>
    </div>
  </div>`,
  styleUrls: ['./warranty-summary-card.component.scss'],
})
export class WarrantySummaryCardComponent implements OnInit {
  token = {
    network: 'MATIC',
    value: 'USDC',
    logoRoute: 'assets/img/coins/USDC-POLYGON.svg',
  };
  @Input() title: string;
  @Input() documentTitle: string;
  @Input() amountTitle: string;
  @Input() warrantyData;
  @Input() serviceCost: string;
  constructor() {}

  ngOnInit() {}
}
