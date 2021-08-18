import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvestmentProductInterface } from './investment-product-card.interface';
import { TranslateService } from '@ngx-translate/core';
import { Plugins } from '@capacitor/core';
import { SubmitButtonService } from '../../../../../shared/services/submit-button/submit-button.service';

const { Browser } = Plugins;

@Component({
  selector: 'app-investment-product-card',
  template: `
    <div class="ipc" [ngClass]="[this.productData?.style]">
      <div class="ipc__content">
        <div class="ipc__content__title_and_risk">
          <div>
            <ion-text class="ux-font-header-titulo" color="uxlight">{{ this.productData?.title }}</ion-text>
          </div>
          <div class="ipc__content__title_and_risk__risk_container">
            <ion-text class="ux-font-header-titulo" color="uxlight">{{
              'funds.fund_investment.card.risk_label' | translate
            }}</ion-text>

            <div
              class="ipc__content__title_and_risk__risk_container__bar_levels"
              [ngClass]="this.productData?.risk_class"
            >
              <div class="bar bar_one"></div>
              <div class="bar bar_two"></div>
              <div class="bar bar_three"></div>
              <div class="bar bar_four"></div>
              <div class="bar bar_five"></div>
            </div>
          </div>
        </div>
        <div class="ipc__content__description">
          <ion-text class="ux-font-text-xs" color="uxlight">{{ this.productData?.description | translate }}</ion-text>
        </div>
        <div class="ipc__content__capital_and_info">
          <div class="ipc__content__capital_and_info__capital">
            <div class="ipc__content__capital_and_info__capital__number">
              <ion-label>
                <ion-text class="ux-font-text-regular" color="uxlight">{{ this.productData?.min_capital }} </ion-text>
                <ion-text class="ux-font-text-xxs" color="uxlight">{{
                  'funds.fund_investment.card.currency' | translate
                }}</ion-text>
              </ion-label>
            </div>
            <div class="ipc__content__capital_and_info__capital__label">
              <ion-text class="ux-font-text-regular" color="uxlight">{{
                'funds.fund_investment.card.min_capital_label' | translate
              }}</ion-text>
            </div>
          </div>
          <div class="ipc__content__capital_and_info__info">
            <ion-text (click)="this.moreInfo()" class="ux-font-button-small" color="uxlight">{{
              'funds.fund_investment.card.more_info' | translate
            }}</ion-text>
          </div>
        </div>
      </div>
      <div class="ipc__footer">
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
        <div class="ipc__footer__last_year_revenue">
          <div class="ipc__footer__last_year_revenue__label">
            <ion-text class="ux-font-text-regular" color="uxlight">{{
              'funds.fund_investment.card.last_year_revenue' | translate
            }}</ion-text>
          </div>
          <div class="ipc__footer__last_year_revenue__value_and_icon">
            <ion-text class="ux-font-text-lg" color="uxlight">+{{ this.productData?.percentage }}% </ion-text>
            <ion-icon
              *ngIf="this.productData.currency === 'USDT'"
              class="ipc__footer__last_year_revenue__value_and_icon__icon"
              name="ux-tether-logo"
            ></ion-icon>
            <ion-icon
              *ngIf="this.productData.currency === 'BTC'"
              class="ipc__footer__last_year_revenue__value_and_icon__icon"
              name="ux-btc-logo"
            ></ion-icon>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./investment-product-card.component.scss'],
})
export class InvestmentProductCardComponent implements OnInit {
  @Input() product: InvestmentProductInterface;
  @Output() save = new EventEmitter<any>();

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
    currency: '',
  };

  productType = {
    volume_profile_strategies_USDT: {
      title: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.title',
      description: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.description',
      style: 'green-style',
    },
    volume_profile_strategies_BTC: {
      title: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.title',
      description: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.description',
      style: 'orange-style',
    },
    DeFi_index: {
      title: 'funds.fund_investment.card.profiles.DeFi_index.title',
      description: 'funds.fund_investment.card.profiles.DeFi_index.description',
      style: 'light-blue-style',
    },
    Mary_index: {
      title: 'funds.fund_investment.card.profiles.Mary_index.title',
      description: 'funds.fund_investment.card.profiles.Mary_index.description',
      style: 'purple-style',
    },
  };

  constructor(private translate: TranslateService, public submitButtonService: SubmitButtonService) {
    Browser.prefetch({
      urls: ['https://www.info.xcapit.com/'],
    });
  }

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

  async moreInfo() {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: this.productData.link_info,
    });
  }

  handleSubmit(profile) {
    this.save.emit(profile);
  }
}
