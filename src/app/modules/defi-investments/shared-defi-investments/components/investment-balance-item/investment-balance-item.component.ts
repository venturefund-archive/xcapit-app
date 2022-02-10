import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';

@Component({
  selector: 'app-investment-balance-item',
  template: `
      <div (click)="this.goToDetail()" class="ibi" name="go_to_invest_detail">
        <div class="ibi__image">
          <div>
            <img class="ibi__image__img" [src]="this.token?.logoRoute" alt="Product Image" />
          </div>
        </div>
        <div class="ibi__content">
          <div class="ibi__content__group">
            <ion-text class="ux-font-text-lg symbol">{{
              this.token?.value
            }}</ion-text>
            <ion-text class="ux-font-text-lg balance">{{
              this.balance| number: '1.2-8'
            }}</ion-text>
          </div>
          <div class="ibi__content__group">
            <ion-text class="ux-font-text-xs description">{{
              (this.token?.name | splitString: ' - ')[1]  
            }}</ion-text>
            <ion-text class="ux-font-text-xs converted-balance">{{
             this.referenceBalance | number: '1.2-2'
            }}{{' USD'}}</ion-text>
          </div>
          <div class="ibi__content__group">
            <ion-badge class="ux-font-num-subtitulo ux_badge_coming ibi__content__group__badge" slot="end"
              >{{ this.apy  | number: '1.2-2' }}%
              {{ 'defi_investments.shared.defi_investment_product.annual' | translate }}</ion-badge
            >
          </div>
        </div>
      </div>
  `,
  styleUrls: ['./investment-balance-item.component.scss'],
})
export class InvestmentBalanceItemComponent implements OnInit {
  constructor(private navController : NavController, private apiWalletService : ApiWalletService) {}
  @Input() balance : number;
  referenceBalance: number;
  token : Coin;
  @Input() investmentProduct : InvestmentProduct;
  apy: number;
  async ngOnInit() {
    this.apy = this.investmentProduct.apy();
    this.token = this.investmentProduct.token();
    this.getPrice();
  }

  private getPrice() {
    this.apiWalletService
      .getPrices([this.token.value], false)
      .subscribe((res) => (this.referenceBalance = res.prices[this.token.value] * this.balance));
  }

  goToDetail(){
    this.navController.navigateForward(['/defi/investment-detail',this.investmentProduct.name()])
  }
}
