import { Component, OnInit } from '@angular/core';
import { DEFI_PRODUCTS } from '../shared-defi-investments/constants/defi-products';

@Component({
  selector: 'app-defi-investment-products',
  template:`
   <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.investments.defi_investment_products.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="dp">
        <div class="dp__background"></div>
        <div class="dp__card ion-padding-start ion-padding-end">
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
  defiProducts = DEFI_PRODUCTS;
  constructor() { }

  ngOnInit() {
    
  }

}
