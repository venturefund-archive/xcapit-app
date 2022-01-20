import { Component, Input, OnInit } from '@angular/core';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { defiProduct } from '../../interfaces/defi-product.interface';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { TwoPiApi } from '../../models/two-pi-api/two-pi-api.model';
import { TwoPiInvestmentProduct } from '../../models/two-pi-investment-product/two-pi-investment-product.model';
import { TwoPiContractService } from '../../services/two-pi-contract/two-pi-contract.service';

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
  constructor(private twoPiContractService: TwoPiContractService, private twoPiApi: TwoPiApi, private apiWalletService : ApiWalletService) {}
  @Input() product : defiProduct;
  balance : number;
  investmentProduct : InvestmentProduct;
  apy: number;
  ngOnInit() {
    this.getInvestmentProduct();
    this.getProductBalance();
  }

  async getProductBalance(){
    this.balance = parseInt(await this.twoPiContractService.getBalance(this.investmentProduct));
  }
  
  async getInvestmentProduct() {
    this.investmentProduct = new TwoPiInvestmentProduct(
      await this.twoPiApi.vault(this.product.id),
      this.apiWalletService
    );
    this.apy = this.investmentProduct.apy()
  }

}
