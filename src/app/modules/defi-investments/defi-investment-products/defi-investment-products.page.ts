import { Component, OnInit, setTestabilityGetter } from '@angular/core';
import { DEFI_PRODUCTS } from '../shared-defi-investments/constants/defi-products';

@Component({
  selector: 'app-defi-investment-products',
  template:`
   <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/investments"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'defi_investments.defi_investment_products.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
    <div *ngIf="this.haveInvestments" class="dp">
        <div class="dp__background"></div>                               
        <div class="dp__card ">
          <ion-item lines="none" slot="header">
            <ion-label>{{ 'defi_investments.defi_investment_products.title_investments' | translate }}</ion-label>
          </ion-item>
            <app-investment-balance-item></app-investment-balance-item>
        </div>
      </div>
      <div class="dp">
        <div [ngClass]="{
            dp__background: this.haveInvestments === false,
            'dp__background-off': this.haveInvestments === true
          }"
          class="dp__background"></div>                              
        <div class="dp__card ">
          <ion-item lines="none" slot="header">
            <ion-label>{{ this.settedTitle | translate}}  </ion-label>
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
  defiProducts = DEFI_PRODUCTS;
  constructor() { }
  haveInvestments 
  settedTitle
  ngOnInit() {
    this.checkInvestments();
  }

  checkInvestments(){
    this.haveInvestments = true;
    this.setTitle();
  }
  setTitle(){
    this.settedTitle =  !this.haveInvestments ? 'defi_investments.defi_investment_products.title' : 'defi_investments.defi_investment_products.recommendations';
  }

}
