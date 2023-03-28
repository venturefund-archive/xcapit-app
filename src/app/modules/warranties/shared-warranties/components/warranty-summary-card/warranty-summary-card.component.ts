import { Component, Input, OnInit } from '@angular/core';
import { NETWORK_COLORS } from 'src/app/modules/wallets/shared-wallets/constants/network-colors.constant';
import { SummaryWarrantyData } from 'src/app/modules/warranties/send-warranty/interfaces/summary-warranty-data.interface';

@Component({
  selector: 'app-warranty-summary-card',
  template: ` <div class="wsc ion-padding ux-card">
    <div class="wsc__title">
      <ion-text class="ux-font-text-lg">
        {{ this.title }}
      </ion-text>
    </div>
    <div class="wsc__item">
      <div class="wsc__item__container">
        <div class="wsc__item__container__title_and_image">
          <div class="wsc__item__container__title_and_image__image_container">
            <img [src]="this.token.logoRoute" alt="Product Image" />
          </div>
          <div class="wsc__item__container__title_container">
            <div class="wsc__item__container__title_container__title">
              <ion-text class="ux-font-text-lg">{{ this.token.value }}</ion-text>
            </div>
            <div class="wsc__item__container__title_container__badge">
              <ion-badge [color]="this.networkColors[this.token.network]" class="ux-badge ux-font-num-subtitulo">{{
                this.token.network | formattedNetwork | uppercase
              }}</ion-badge>
            </div>
          </div>
        </div>
        <div class="wsc__item__container__amount">
          <div>
            <ion-text class="ux-font-text-lg"
              >{{ this.warrantyData?.amount | formattedAmount }}
              {{ this.token.value | titlecase | uppercase }}</ion-text
            >
          </div>
          <div class="wsc__item__container__amount__conversion">
            <ion-text class="ux-font-text-xs">
              = {{ this.warrantyData?.quoteAmount | formattedAmount : 10 : 2 }} USD
            </ion-text>
          </div>
        </div>
      </div>
      <div class="list-divider"></div>
    </div>
    <div class="wsc__item">
      <div class="wsc__item__title__email">
        <ion-text class="ux-font-titulo-xs">{{ this.emailTitle }}</ion-text>
      </div>
      <div class="wsc__item__content__email">
        <ion-text class="ux-font-text-base">{{ this.warrantyData?.email }}</ion-text>
      </div>
      <div class="list-divider"></div>
    </div>
    <div class="wsc__item">
      <div class="wsc__item__title__dni">
        <ion-text class="ux-font-titulo-xs">{{ this.documentTitle }}</ion-text>
      </div>
      <div class="wsc__item__content__dni">
        <ion-text class="ux-font-text-base">{{ this.warrantyData?.user_dni }}</ion-text>
      </div>
      <div class="list-divider"></div>
    </div>
    <div class="wsc__item">
      <div class="wsc__item__title__amount">
        <ion-text class="ux-font-titulo-xs">{{ this.amountTitle }}</ion-text>
      </div>
      <div class="wsc__item__content__amount" *ngIf="this.warrantyData.amountWithoutCost">
        <ion-text class="ux-font-text-base"
          >{{ this.warrantyData.amountWithoutCost | formattedAmount }} {{ this.token.value }}</ion-text
        >
        <ion-text class="ux-font-text-base"
          >{{ this.warrantyData.quoteAmountWithoutCost | formattedAmount : 10 : 2 }} USD</ion-text
        >
      </div>
      <div class="list-divider"></div>
    </div>
    <div class="wsc__item" *ngIf="this.warrantyData.service_cost">
      <div class="wsc__item__title__service-cost">
        <ion-text class="ux-font-titulo-xs">{{ this.serviceCost }}</ion-text>
      </div>
      <div class="wsc__item__content__amount-service-cost">
        <ion-text class="ux-font-text-base">{{ this.warrantyData?.service_cost }} {{ this.token.value }}</ion-text>
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
  @Input() emailTitle: string;
  @Input() amountTitle: string;
  @Input() warrantyData: SummaryWarrantyData;
  @Input() serviceCost: string;
  networkColors = NETWORK_COLORS;

  constructor() {}

  ngOnInit() {}
}
