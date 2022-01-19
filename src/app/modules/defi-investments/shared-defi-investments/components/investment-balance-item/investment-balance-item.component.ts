import { Component, Input, OnInit } from '@angular/core';
import { TwoPiService } from '../../services/two-pi/two-pi.service';

@Component({
  selector: 'app-investment-balance-item',
  template: `
      <div class="ibi">
        <div class="ibi__image">
          <div>
            <img class="ibi__image__img" [src]="this.product.image" alt="Product Image" />
          </div>
        </div>
        <div class="ibi__content">
          <div class="ibi__content__group">
            <ion-text class="ux-font-text-lg symbol">{{
              this.product.symbol 
            }}</ion-text>
            <ion-text class="ux-font-text-lg balance">{{
              this.balance| number: '1.8-8'
            }}</ion-text>
          </div>
          <div class="ibi__content__group">
            <ion-text class="ux-font-text-xs description">{{
              this.product.subtitle 
            }}</ion-text>
            <ion-text class="ux-font-text-xs converted-balance">{{
             0
            }}{{' USD'}}</ion-text>
          </div>
          <div class="ibi__content__group">
            <ion-badge class="ux-font-num-subtitulo ux_badge_coming ibi__content__group__badge" slot="end"
              >{{ this.apy  | number: '1.2-2' }}%
              {{ 'defi_investments.shared_defi_investments.defi_investment_product.annual' | translate }}</ion-badge
            >
          </div>
        </div>
      </div>
  `,
  styleUrls: ['./investment-balance-item.component.scss'],
})
export class InvestmentBalanceItemComponent implements OnInit {
  constructor(private twoPiService : TwoPiService) {}
  @Input() product;
  balance
  vaults = [];
  apy: number;
  ngOnInit() {
    this.getProductBalance();
    this.getProductApy();
  }

  async getProductBalance(){
    this.balance = parseInt(await this.twoPiService.getBalance(this.product));
  }

  async getProductApy(){
    const vault =  this.twoPiService.getVaults().find((vault) => (vault.id === this.product.id));
    this.apy = await vault.apy() * 100;
  }

}
