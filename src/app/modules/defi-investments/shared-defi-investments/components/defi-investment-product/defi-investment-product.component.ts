import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { WalletService } from './../../../../wallets/shared-wallets/services/wallet/wallet.service';
import { TwoPiInvestmentProduct } from '../../models/two-pi-investment-product/two-pi-investment-product.model';
import { ApiWalletService } from '../../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiApi } from '../../models/two-pi-api/two-pi-api.model';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-defi-investment-product',
  template: `
    <div class="dip">
      <div class="dip__content">
        <div class="dip__content__title_and_image">
          <div class="dip__content__title_and_image__image_container">
            <img [src]="this.token?.logoRoute" alt="Product Image" />
          </div>
          <div class="dip__title_container">
            <ion-text class="ux-font-text-lg">{{ this.token?.value }}</ion-text>
            <div class="dip__content__title">
              <ion-text class="ux-font-text-xs title">{{ this.token?.name | splitString: ' - '[1] }}</ion-text>
            </div>
          </div>
        </div>
        <div class="dip__content__performance">
          <ion-text class="ux-font-text-xxs dip__content__performance__perf">{{
            'defi_investments.shared.defi_investment_product.performance' | translate
          }}</ion-text>
          <ion-badge class="ux-font-num-subtitulo ux_badge_coming dip__footer__badge" slot="end"
            >{{ this.apy | number: '1.2-2' }}%
            {{ 'defi_investments.shared.defi_investment_product.annual' | translate }}</ion-badge
          >
        </div>
        <div class="dip__content__liquidity">
          <div class="dip__content__liquidity__label">
            <ion-text class="ux-font-text-xxs">{{
              'defi_investments.shared.defi_investment_product.liquidity' | translate
            }}</ion-text>
          </div>
          <div class="dip__content__liquidity__liq">
            <ion-text class="ux-font-text-xxs">{{ tvl | number: '1.2-2' }} USD</ion-text>
          </div>
        </div>
      </div>
      <div class="dip__footer">
        <div class="dip__footer__info">
          <div class="dip__footer__info__label">
            <ion-text class="ux-font-text-xxs">{{
              'defi_investments.shared.defi_investment_product.not_min_ammount' | translate
            }}</ion-text>
          </div>
          <div class="dip__footer__info__label">
            <ion-text class="ux-font-text-xxs">{{
              'defi_investments.shared.defi_investment_product.immediate_rescue' | translate
            }}</ion-text>
          </div>
        </div>
        <div class="dip__footer__button ">
          <ion-button
            *ngIf="!this.product?.isComing"
            appTrackClick
            (click)="this.invest()"
            name="Invest"
            type="button"
            class="ux-font-button"
          >
            {{ 'defi_investments.shared.defi_investment_product.invest_button' | translate }}
          </ion-button>
          <ion-badge
            *ngIf="this.product?.isComing"
            class="ux-font-num-subtitulo ux_badge_coming dip__footer__badge"
            slot="end"
            >{{ 'defi_investments.shared.defi_investment_product.comming_badge' | translate }}</ion-badge
          >
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./defi-investment-product.component.scss'],
})
export class DefiInvestmentProductComponent implements OnInit {
  @Input() product;
  investmentProduct: TwoPiInvestmentProduct;
  apy: number;
  tvl: string;
  token: Coin;

  constructor(
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private walletService: WalletService,
    private twoPiApi: TwoPiApi
  ) {}

  ngOnInit() {
    this.getInvestmentProduct();
  }

  async invest() {
    if (!(await this.walletService.walletExist())) {
      this.navController.navigateForward(['/defi/no-wallet-to-invest']);
    }
  }

  async getInvestmentProduct() {
    this.investmentProduct = new TwoPiInvestmentProduct(
      await this.twoPiApi.vault(this.product.id),
      this.apiWalletService
    );
    this.apy = this.investmentProduct.apy();
    this.tvl = this.investmentProduct.tvl();
    this.token = this.investmentProduct.token();
  }
}
