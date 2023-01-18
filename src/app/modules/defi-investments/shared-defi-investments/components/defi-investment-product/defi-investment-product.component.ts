import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { WalletService } from '../../../../wallets/shared-wallets/services/wallet/wallet.service';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DefiInvestment } from '../../interfaces/defi-investment.interface';

@Component({
  selector: 'app-defi-investment-product',
  template: `
    <div class="dip">
      <div class="dip__content" [ngClass]="{ 'dip__content-rounded': this.investment.balance === null }">
        <div class="dip__content__title_and_image">
          <div class="dip__content__title_and_image__image_container">
            <img [src]="this.token?.logoRoute" />
          </div>
          <div class="dip__title_container">
            <ion-text class="ux-font-text-lg">{{ this.token.value }}</ion-text>
            <div class="dip__content__title">
              <ion-text class="ux-font-text-xs title">{{ this.token.name | splitString: ' - '[1] }}</ion-text>
            </div>
          </div>
        </div>
        <div class="dip__content__performance">
          <ion-text class="ux-font-text-xxs dip__content__performance__perf">{{
            'defi_investments.shared.defi_investment_product.performance' | translate
          }}</ion-text>
          <ion-badge class="ux-font-num-subtitulo ux-badge-coming dip__footer__badge" slot="end"
            >{{ this.apy | number: '1.2-2' }}%
            {{ 'defi_investments.shared.defi_investment_product.annual' | translate }}</ion-badge
          >
        </div>
      </div>
      <div class="dip__footer" *ngIf="this.investment.balance !== null">
        <div class="dip__footer__info">
          <div class="dip__footer__info__label" [ngClass]="{ 'single-row-footer': this.investment.isComing }">
            <ion-text class="ux-font-text-xxs">{{
              'defi_investments.shared.defi_investment_product.not_min_ammount' | translate
            }}</ion-text>
          </div>
          <div class="dip__footer__info__label" *ngIf="!this.investment.isComing">
            <ion-text class="ux-font-text-xxs">{{ this.secondFooterLabel | translate }}</ion-text>
          </div>
        </div>
        <div class="dip__footer__button" [ngClass]="{ 'single-row-footer': this.investment.isComing }">
          <ion-button
            *ngIf="!this.investment.isComing"
            appTrackClick
            (click)="this.invest()"
            name="Invest"
            [dataToTrack]="{ eventLabel: this.trackClickName }"
            type="button"
            class="ux-font-button"
          >
            {{ 'defi_investments.shared.defi_investment_product.invest_button' | translate }}
          </ion-button>
          <ion-badge
            *ngIf="this.investment.isComing"
            class="ux-font-num-subtitulo ux-badge-coming dip__footer__badge"
            slot="end"
            >{{ 'defi_investments.shared.defi_investment_product.coming_badge' | translate }}</ion-badge
          >
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./defi-investment-product.component.scss'],
})
export class DefiInvestmentProductComponent implements OnInit {
  @Input() investment: DefiInvestment;
  apy: number;
  token: Coin;
  secondFooterLabel: string;
  trackClickName: string;

  constructor(private navController: NavController, private walletService: WalletService) {}

  ngOnInit() {
    this.apy = this.investment.product.apy();
    this.token = this.investment.product.token();
    this.secondFooterLabel = this.investment.continuousEarning
      ? 'defi_investments.shared.defi_investment_product.continuous_earnings'
      : 'defi_investments.shared.defi_investment_product.weekly_earnings';
    this.trackClickName = `ux_invest_${this.token.value.toLowerCase()}`;
  }

  async invest() {
    const walletExist = await this.walletService.walletExist();
    if (walletExist) {
      this.navController.navigateForward(['/defi/new/insert-amount', this.investment.product.name(), 'invest']);
    } else {
      this.navController.navigateForward(['/defi/no-wallet-to-invest']);
    }
  }
}
