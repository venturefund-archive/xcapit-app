import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvestmentProductInterface } from './investment-product-card.interface';
import { TranslateService } from '@ngx-translate/core';
import { Plugins } from '@capacitor/core';
import { SubmitButtonService } from '../../../../../shared/services/submit-button/submit-button.service';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiApikeysService } from 'src/app/modules/apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { NoApikeysModalComponent } from '../no-apikeys-modal/no-apikeys-modal.component';

const { Browser } = Plugins;

@Component({
  selector: 'app-investment-product-card',
  template: `
    <div class="ipc" [ngClass]="[this.productData?.style]">
      <div class="ipc__content">
        <div class="ipc__content__title_and_image">
          <div class="title_container">
            <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-12" color="uxdark">{{
              this.productData?.strategie_type | translate
            }}</ion-text>
            <ion-text class="ux-font-gilroy ux-fweight-bold ux-fsize-16" color="uxdark">{{
              this.productData?.title
            }}</ion-text>
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
              color="uxsecondary"
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
              <ion-text class="ux-font-lato ux-fweight-semibold ux-fsize-18" color="uxlight"
                >{{ this.productData?.min_capital }}
              </ion-text>
              <ion-text class="ux-font-lato ux-fweight-semibold ux-fsize-12" color="uxlight">{{
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
              this.invest({
                risk_level: this.productData.profile,
                currency: this.productData.currency
              })
            "
            class="ux-font-lato ux-fweight-semibold ux-fsize-14"
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
  strategie: any;

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
    strategie_type: '',
  };

  productType = {
    volume_profile_strategies_USDT: {
      title: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.title',
      description: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.description',
      more_info: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.more_info',
      image: 'assets/img/investment-products/denali.svg',
      strategie_type: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.strategie_type',
      style: 'green-style',
    },
    volume_profile_strategies_BTC: {
      title: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.title',
      description: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.description',
      more_info: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.more_info',
      image: 'assets/img/investment-products/olimpusMoon.svg',
      strategie_type: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.strategie_type',
      style: 'orange-style',
    },
    DeFi_index: {
      title: 'funds.fund_investment.card.profiles.DeFi_index.title',
      description: 'funds.fund_investment.card.profiles.DeFi_index.description',
      more_info: 'funds.fund_investment.card.profiles.DeFi_index.more_info',
      image: 'assets/img/investment-products/himalayas.svg',
      strategie_type: 'funds.fund_investment.card.profiles.DeFi_index.strategie_type',
      style: 'light-blue-style',
    },
    Mary_index: {
      title: 'funds.fund_investment.card.profiles.Mary_index.title',
      description: 'funds.fund_investment.card.profiles.Mary_index.description',
      more_info: 'funds.fund_investment.card.profiles.Mary_index.more_info',
      image: 'assets/img/investment-products/andes.svg',
      strategie_type: 'funds.fund_investment.card.profiles.Mary_index.strategie_type',
      style: 'purple-style',
    },
  };

  constructor(
    private modalController: ModalController,
    private apiApikeysService: ApiApikeysService,
    private route: ActivatedRoute,
    private navController: NavController,
    private translate: TranslateService,
    public submitButtonService: SubmitButtonService
  ) {
    Browser.prefetch({
      urls: ['https://www.info.xcapit.com/'],
    });
  }

  ngOnInit() {
    this.setProductData();
    this.getAllApiKeys();
  }

  setProductData() {
    this.productData = {
      ...this.product,
      ...this.productType[this.product.profile],
    };

    this.productData.risk_class = this.getRiskClass();
    this.productData.title = this.translate.instant(this.productData.title);
  }

  invest(profile) {
    if (this.apikeys.length === 0) {
      this.openModal();
    } else {
      this.handleSubmit(profile);
    }
  }

  getRiskClass() {
    return `risk-${this.productData.risk}`;
  }

  getAllApiKeys() {
    this.apiApikeysService.getAll().subscribe((data) => {
      this.apikeys = data;
    });
  }

  checkEmptyApikeys() {
    if (this.apikeys.length === 0) {
      this.openModal();
    } else {
      this.checkBalance();
    }
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: NoApikeysModalComponent,
      cssClass: 'ux-modal-no-apikeys',
      swipeToClose: false,
    });
    await modal.present();
  }

  checkBalance() {}

  moreInfo() {
    const title = this.productData.title !== 'Olympus Mons' ? this.productData.title : 'Olympus';
    this.navController.navigateForward(['funds/fund-investment-info', title]);
  }

  handleSubmit(profile) {
    this.save.emit(profile);
  }
}
