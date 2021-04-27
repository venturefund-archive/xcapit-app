import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvestmentProductInterface } from './investment-product-card.interface';
import { TranslateService } from '@ngx-translate/core';
import { Plugins } from '@capacitor/core';
import { SubmitButtonService } from '../../../../../shared/services/submit-button/submit-button.service';

const { Browser } = Plugins;

@Component({
  selector: 'app-investment-product-card',
  template: `
      <div class="ipc" [ngClass]="[this.product_data?.style]">
          <div class="ipc__content">
              <div class="ipc__content__title_and_risk">
                  <div>
                      <ion-text
                              class="ux-font-gilroy ux-fweight-bold ux-fsize-22"
                              color="uxlight"
                      >{{ this.product_data?.title }}</ion-text
                      >
                  </div>
                  <div class="ipc__content__title_and_risk__risk_container">
                      <ion-text
                              class="ux-font-gilroy ux-fweight-semibold ux-fsize-12"
                              color="uxlight"
                      >{{
                          'funds.fund_investment.card.risk_label' | translate
                          }}</ion-text
                      >

                      <div
                              class="ipc__content__title_and_risk__risk_container__bar_levels"
                              [ngClass]="this.product_data?.risk_class"
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
                  <ion-text
                          class="ux-font-lato ux-fweight-semibold ux-fsize-14"
                          color="uxlight"
                  >{{ this.product_data?.description }}</ion-text
                  >
              </div>
              <div class="ipc__content__capital_and_info">
                  <div class="ipc__content__capital_and_info__capital">
                      <div class="ipc__content__capital_and_info__capital__number">
                          <ion-label>
                              <ion-text
                                      class="ux-font-lato ux-fweight-semibold ux-fsize-18"
                                      color="uxlight"
                              >{{ this.product_data?.min_capital }}
                              </ion-text>
                              <ion-text
                                      class="ux-font-lato ux-fweight-semibold ux-fsize-12"
                                      color="uxlight"
                              >{{
                                  'funds.fund_investment.card.currency' | translate
                                  }}</ion-text
                              >
                          </ion-label>
                      </div>
                      <div class="ipc__content__capital_and_info__capital__label">
                          <ion-text
                                  class="ux-font-lato ux-fweight-semibold"
                                  color="uxlight"
                          >{{
                              'funds.fund_investment.card.min_capital_label' | translate
                              }}</ion-text
                          >
                      </div>
                  </div>
                  <div class="ipc__content__capital_and_info__info">
                      <ion-text
                              (click)="this.moreInfo()"
                              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
                              color="uxlight"
                      >{{
                          'funds.fund_investment.card.more_info' | translate
                          }}</ion-text
                      >
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
                risk_level: this.product_data.profile,
                currency: this.product_data.currency
              })
            "
                          class="ux-font-lato ux-fweight-semibold ux-fsize-14"
                  >
                      {{ 'funds.fund_investment.card.invest_button' | translate }}
                  </ion-button>
              </div>
              <div class="ipc__footer__last_year_revenue">
                  <div class="ipc__footer__last_year_revenue__label">
                      <ion-text
                              class="ux-font-lato ux-fweight-semibold"
                              color="uxlight"
                      >{{
                          'funds.fund_investment.card.last_year_revenue' | translate
                          }}</ion-text
                      >
                  </div>
                  <div class="ipc__footer__last_year_revenue__value_and_icon">
                      <ion-text
                              class="ux-font-gilroy ux-fweight-bold ux-fsize-18"
                              color="uxlight"
                      >+{{ this.product_data?.percentage }}%
                      </ion-text
                      >
                      <ion-icon
                              *ngIf="this.product_data.currency == 'USDT'"
                              class="ipc__footer__last_year_revenue__value_and_icon__icon"
                              name="ux-tether-logo"
                      ></ion-icon>
                      <ion-icon
                              *ngIf="this.product_data.currency == 'BTC'"
                              class="ipc__footer__last_year_revenue__value_and_icon__icon"
                              name="ux-btc-logo"
                      ></ion-icon>
                  </div>
              </div>
          </div>
      </div>
  `,
  styleUrls: ['./investment-product-card.component.scss']
})
export class InvestmentProductCardComponent implements OnInit {
  @Input() product: InvestmentProductInterface;
  @Output() save = new EventEmitter<any>();

  product_data = {
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
    currency: ''
  };

  product_type = {
    volume_profile_strategies_USDT: {
      title:
        'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.title',
      description:
        'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.description',
      style: 'green-style'
    },
    volume_profile_strategies_BTC: {
      title:
        'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.title',
      description:
        'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.description',
      style: 'orange-style'
    },
    DeFi_index: {
      title: 'funds.fund_investment.card.profiles.DeFi_index.title',
      description: 'funds.fund_investment.card.profiles.DeFi_index.title',
      style: 'light-blue-style'
    },
    Mary_index: {
      title: 'funds.fund_investment.card.profiles.Mary_index.title',
      description: 'funds.fund_investment.card.profiles.Mary_index.title',
      style: 'purple-style'
    }
  };

  constructor(
    private translate: TranslateService,
    public submitButtonService: SubmitButtonService
  ) {
    Browser.prefetch({
      urls: ['https://www.info.xcapit.com/']
    });
  }

  ngOnInit() {
    this.setProductData();
  }

  setProductData() {
    this.product_data = {
      ...this.product,
      ...this.product_type[this.product.profile]
    };

    this.product_data.risk_class = this.getRiskClass();
    this.product_data.title = this.translate.instant(this.product_data.title);
    this.product_data.description = this.translate.instant(
      this.product_data.description
    );
  }

  getRiskClass() {
    return `risk-${this.product_data.risk}`;
  }

  async moreInfo() {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: this.product_data.link_info
    });
  }

  handleSubmit(profile) {
    this.save.emit(profile);
  }
}
