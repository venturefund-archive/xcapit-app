import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-kripton-purchase-info',
  template: `
    <div class="kpi__buy">
      <ion-label class="kpi__buy__title ux-font-text-lg">{{
        'fiat_ramps.shared.kripton_purchase_info.title' | translate
      }}</ion-label>
      <ion-accordion-group class="kpi__buy__accordion-group">
        <ion-accordion class="kpi__buy__accordion-group__accordion accordion-arrow-info" value="first">
          <ion-item class="kpi__buy__accordion-group__accordion__item" slot="header">
            <div class="kpi__buy__accordion-group__accordion__item__header">
              <img [src]="'assets/img/coins/' + this.currencyOut + '.svg'" />
              <div class="kpi__buy__accordion-group__accordion__item__header__coin">
                <ion-label
                  class="kpi__buy__accordion-group__accordion__item__header__coin__value ux-font-header-titulo"
                  >{{ this.currencyOut }}</ion-label
                >
                <app-token-network-badge [blockchainName]="this.network"></app-token-network-badge>
              </div>
              <ion-label class="kpi__buy__accordion-group__accordion__item__header__value ux-font-header-titulo"
                >{{ this.amountOut | formattedAmount }} {{ this.currencyOut }}</ion-label
              >
            </div>
          </ion-item>
          <div class="kpi__buy__accordion-group__accordion__item__content ion-padding" slot="content">
            <div class="kpi__buy__accordion-group__accordion__item__content__data">
              <ion-label class="ux-font-titulo-xs">
                {{ 'fiat_ramps.shared.kripton_purchase_info.quote' | translate }}</ion-label
              >
              <ion-label class="kpi__buy__accordion-group__accordion__item__content__data__value ux-font-text-base"
                >1 {{this.currencyOut}} = {{this.priceOut | formattedAmount: 10:2}} {{this.currencyIn}}</ion-label
              >
            </div>
            <div class="kpi__buy__accordion-group__accordion__item__content__data">
              <ion-label class="ux-font-titulo-xs">{{
                'fiat_ramps.shared.kripton_purchase_info.operation' | translate
              }}</ion-label>
              <ion-label class="kpi__buy__accordion-group__accordion__item__content__data__value ux-font-text-base"
                >N° {{this.operationId}}</ion-label
              >
            </div>
          </div>
        </ion-accordion>
      </ion-accordion-group>
    </div>
  `,
  styleUrls: ['./kripton-purchase-info.component.scss'],
})
export class KriptonPurchaseInfoComponent implements OnInit {
  @Input() currencyOut: string;
  @Input() currencyIn: string;
  @Input() network: string;
  @Input() amountOut: number;
  @Input() priceOut: number;
  @Input() operationId: number;
  constructor() {}

  ngOnInit() {
    this.amountOut = Number(this.amountOut);
    this.priceOut = Number(this.priceOut);
  }
}
