import { Component, Input, OnInit } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { TwoPiService } from '../../services/two-pi/two-pi.service';

@Component({
  selector: 'app-defi-investment-product',
  template: `
    <div class="dip">
      <div class="dip__content">
        <div class="dip__content__title_and_image">
          <div class="dip__content__title_and_image__image_container">
            <img src="assets/img/coins/USDC.svg" alt="Product Image" />
          </div>
          <div class="dip__title_container">
            <ion-text class="ux-font-text-lg">{{ this.product.symbol }}</ion-text>
            <div class="dip__content__title">
              <ion-text class="ux-font-text-xs title">{{ this.product.subtitle }}</ion-text>
            </div>
          </div>
        </div>
        <div class="dip__content__performance">
          <ion-text class="ux-font-text-xxs dip__content__performance__perf">{{
            'wallets.shared_wallets.defi_investment_product.performance' | translate
          }}</ion-text>
          <ion-badge class="ux-font-num-subtitulo ux_badge_coming dip__footer__badge" slot="end"
            >{{ this.apy | number: '1.2-2' }}%
            {{ 'wallets.shared_wallets.defi_investment_product.annual' | translate }}</ion-badge
          >
        </div>
        <div class="dip__content__liquidity">
          <div class="dip__content__liquidity__liq">
            <ion-text class="ux-font-text-xxs">{{
              'wallets.shared_wallets.defi_investment_product.liquidity' | translate
            }}</ion-text>
          </div>
          <div class="dip__content__liquidity__liq">
            <ion-text class="ux-font-text-xxs">{{ this.formattedTvl | number: '1.2-2' }} USD</ion-text>
          </div>
        </div>
      </div>
      <div class="dip__footer">
        <div class="dip__footer__info">
          <div class="dip__footer__info__label">
            <ion-text class="ux-font-text-xxs">{{
              'wallets.shared_wallets.defi_investment_product.not_min_ammount' | translate
            }}</ion-text>
          </div>
          <div class="dip__footer__info__label">
            <ion-text class="ux-font-text-xxs">{{
              'wallets.shared_wallets.defi_investment_product.immediate_rescue' | translate
            }}</ion-text>
          </div>
        </div>
        <div class="dip__footer__button ">
          <ion-button *ngIf="!this.product.isComming" appTrackClick name="Invest" type="button" class="ux-font-button">
            {{ 'wallets.shared_wallets.defi_investment_product.invest_button' | translate }}
          </ion-button>
          <ion-badge
            *ngIf="this.product.isComming"
            class="ux-font-num-subtitulo ux_badge_coming ipc__footer__badge"
            slot="end"
            >{{ 'wallets.shared_wallets.defi_investment_product.comming_badge' | translate }}</ion-badge
          >
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./defi-investment-product.component.scss'],
})
export class DefiInvestmentProductComponent implements OnInit {
  vaults = [];
  @Input() product;
  filteredVault;
  apy: number;
  tvl: BigNumber;
  formattedTvl;

  constructor(private twoPiService: TwoPiService) {}

  ngOnInit() {
    this.getVaultValues();
  }

  getVaultValues() {
    this.twoPiService.getVaults().filter(async (vault) => {
      if (vault.id === this.product?.id) {
        this.apy = await vault.apy();
        this.tvl = await vault.tvl();
        this.formattedTvl = ethers.utils.formatEther(this.tvl.toString());
      }
    });
  }
}
