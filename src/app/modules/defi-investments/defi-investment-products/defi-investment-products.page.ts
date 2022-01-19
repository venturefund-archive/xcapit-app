import { availableDefiProducts } from './../shared-defi-investments/constants/defi-products';
import { Component, OnInit } from '@angular/core';
import { PROD_DEFI_PRODUCTS } from '../shared-defi-investments/constants/defi-products';

@Component({
  selector: 'app-defi-investment-products',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/investments"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'defi_investments.defi_investment_products.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="dp">
        <div class="dp__background"></div>
        <div class="dp__card ">
          <ion-item lines="none" slot="header">
            <ion-label>{{ 'defi_investments.defi_investment_products.title' | translate }}</ion-label>
          </ion-item>
          <app-defi-investment-product
            *ngFor="let product of this.defiProducts"
            [product]="product"
          ></app-defi-investment-product>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./defi-investment-products.page.scss'],
})
export class DefiInvestmentProductsPage implements OnInit {
  defiProducts = availableDefiProducts.value();
  constructor() {}

  ngOnInit() {}
}
