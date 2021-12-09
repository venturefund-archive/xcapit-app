import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvestmentProductInterface } from './investment-product-card.interface';
import { TranslateService } from '@ngx-translate/core';
import { SubmitButtonService } from '../../../../../shared/services/submit-button/submit-button.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-investment-product-card',
  template: `
    <div class="ipc" [ngClass]="[this.productData?.style]">
      <div class="ipc__content">
        <div class="ipc__content__title_and_image">
          <div class="title_container">
            <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-12" color="uxdark">{{
              this.productData?.strategy_type | translate
            }}</ion-text>
            <div class="ipc__content__title_and_badge">
              <ion-text class="ux-font-header-titulo">{{ this.productData?.title }}</ion-text>
              <ion-badge *ngIf="this.productData?.new_strategy" class=" ipc__badge ux_badge_new_strategy">{{
                'funds.fund_investment.card.new_badge' | translate
              }}</ion-badge>
            </div>
          </div>
          <div class="ipc__content__title_and_image__image_container">
            <img [src]="this.productData?.image" alt="Strategie image" />
          </div>
        </div>
        <div class="ipc__content__description">
          <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-14" color="uxdark">{{
            this.productData?.description | translate
          }}</ion-text>
        </div>
        <div class="ipc__content__info">
          <div class="ipc__content__info__info">
            <ion-text
              (click)="this.moreInfo()"
              class="ux-font-lato ux-fweight-semibold ux-fsize-14"
              color="uxprimary"
              >{{ this.productData?.more_info | translate }}</ion-text
            >
          </div>
        </div>
      </div>
      <div class="ipc__footer">
        <div class="ipc__footer__capital">
          <div class="ipc__footer__capital__label">
            <ion-text class="ux-font-lato ux-fweight-semibold" color="uxlight">{{
              'funds.fund_investment.card.min_capital_label' | translate
            }}</ion-text>
          </div>
          <div class="ipc__footer__capital__number">
            <ion-label>
              <ion-text class="ipc__mincapital ux-font-text-lg" color="uxlight"
                >{{ this.productData?.min_capital }}
              </ion-text>
              <ion-text class="ux-font-num-subtitulo" color="uxlight">{{
                'funds.fund_investment.card.currency' | translate
              }}</ion-text>
            </ion-label>
          </div>
        </div>
        <div class="ipc__footer__button">
          <ion-button
            appTrackClick
            name="Invest"
            type="button"
            [disabled]="this.submitButtonService.isDisabled | async"
            (click)="
              this.handleSubmit({
                risk_level: this.productData.profile,
                currency: this.productData.currency
              })
            "
            class="ux-font-button-small"
          >
            {{ 'funds.fund_investment.card.invest_button' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./investment-product-card.component.scss'],
})
export class InvestmentProductCardComponent implements OnInit {
  @Input() product: InvestmentProductInterface;
  @Output() save = new EventEmitter<any>();
  apikeys: any = [];

  productData = {
    title: '',
    description: '',
    content_style: '',
    footer_style: '',
    button_style: '',
    style: '',
    link_info: '',
    risk: '',
    risk_class: '',
    profile: '',
    min_capital: '',
    percentage: '',
    more_info: '',
    currency: '',
    image: '',
    strategy_type: '',
    new_strategy: false,
  };

  productType = {
    volume_profile_strategies_USDT: {
      title: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.title',
      description: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.description',
      more_info: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.more_info',
      image: 'assets/img/investment-products/denali.svg',
      strategy_type: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.strategy_type',
      style: 'green-style',
      new_strategy: false,
    },
    volume_profile_strategies_BTC: {
      title: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.title',
      description: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.description',
      more_info: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.more_info',
      image: 'assets/img/investment-products/olimpusMoon.svg',
      strategy_type: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.strategy_type',
      style: 'orange-style',
      new_strategy: false,
    },

    Metaverse_index: {
      title: 'funds.fund_investment.card.profiles.Metaverse_index.title',
      description: 'funds.fund_investment.card.profiles.Metaverse_index.description',
      more_info: 'funds.fund_investment.card.profiles.Metaverse_index.more_info',
      image: 'assets/img/investment-products/oasis.svg',
      strategy_type: 'funds.fund_investment.card.profiles.Metaverse_index.strategy_type',
      style: 'light-blue-style',
      new_strategy: true,
    },

    DeFi_index: {
      title: 'funds.fund_investment.card.profiles.DeFi_index.title',
      description: 'funds.fund_investment.card.profiles.DeFi_index.description',
      more_info: 'funds.fund_investment.card.profiles.DeFi_index.more_info',
      image: 'assets/img/investment-products/himalayas.svg',
      strategy_type: 'funds.fund_investment.card.profiles.DeFi_index.strategy_type',
      style: 'light-blue-style',
      new_strategy: false,
    },
    Mary_index: {
      title: 'funds.fund_investment.card.profiles.Mary_index.title',
      description: 'funds.fund_investment.card.profiles.Mary_index.description',
      more_info: 'funds.fund_investment.card.profiles.Mary_index.more_info',
      image: 'assets/img/investment-products/andes.svg',
      strategy_type: 'funds.fund_investment.card.profiles.Mary_index.strategy_type',
      style: 'purple-style',
      new_strategy: false,
    },
  };

  constructor(
    private navController: NavController,
    private translate: TranslateService,
    public submitButtonService: SubmitButtonService
  ) {}

  ngOnInit() {
    this.setProductData();
  }

  setProductData() {
    this.productData = {
      ...this.product,
      ...this.productType[this.product.profile],
    };

    this.productData.risk_class = this.getRiskClass();
    this.productData.title = this.translate.instant(this.productData.title);
  }

  getRiskClass() {
    return `risk-${this.productData.risk}`;
  }

  moreInfo() {
    const title = this.productData.title !== 'Olympus Mons' ? this.productData.title : 'Olympus';
    this.navController.navigateForward(['funds/fund-investment-info', title]);
  }

  handleSubmit(profile) {
    this.save.emit(profile);
  }
}
