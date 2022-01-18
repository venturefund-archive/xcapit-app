import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-investment-balance-item',
  template: `
      <div class="ibi">
        <div class="ibi__image">
          <div>
            <img class="ibi__image__img" [src]="this.activeProduct.logo" alt="Product Image" />
          </div>
        </div>
        <div class="ibi__content">
          <div class="ibi__content__group">
            <ion-text class="ux-font-text-lg symbol">{{
              this.activeProduct.symbol 
            }}</ion-text>
            <ion-text class="ux-font-text-lg balance">{{
              this.activeProduct.balance | number: '1.2-8'
            }}</ion-text>
          </div>
          <div class="ibi__content__group">
            <ion-text class="ux-font-text-xs description">{{
              this.activeProduct.description 
            }}</ion-text>
            <ion-text class="ux-font-text-xs converted-balance">{{
              this.activeProduct.convertedBalance 
            }}{{' USD'}}</ion-text>
          </div>
          <div class="ibi__content__group">
            <ion-badge class="ux-font-num-subtitulo ux_badge_coming ibi__content__group__badge" slot="end"
              >{{ this.activeProduct.liquidity  | number: '1.2-2' }}%
              {{ 'defi_investments.shared_defi_investments.defi_investment_product.annual' | translate }}</ion-badge
            >
          </div>
        </div>
      </div>
  `,
  styleUrls: ['./investment-balance-item.component.scss'],
})
export class InvestmentBalanceItemComponent implements OnInit {
  constructor() {}
  @Input() activeProduct;
  ngOnInit() {}
}
