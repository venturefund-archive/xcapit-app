import { InvestmentProduct } from './../../interfaces/investment-product.interface';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { Component, Input, OnInit } from '@angular/core';
import { NETWORK_COLORS } from 'src/app/modules/wallets/shared-wallets/constants/network-colors.constant';
import { DefiProduct } from '../../interfaces/defi-product.interface';
import { AvailableDefiProducts } from '../../models/available-defi-products/available-defi-products.model';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { ModalController } from '@ionic/angular';
import { WithdrawInfoModalComponent } from '../withdraw-info-modal/withdraw-info-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { LINKS } from 'src/app/config/static-links';

@Component({
  selector: 'app-expandable-investment-info',
  template: `
    <ion-accordion-group class="eif">
      <ion-accordion
        class="eif__accordion"
        value="investment-info"
        appTrackClick
        [dataToTrack]="{ eventLabel: this.trackClickName }"
      >
        <ion-item slot="header" class="eif__accordion__header">
          <div class="eif__accordion__header__content">
            <img [src]="this.token?.logoRoute" />
            <div class="eif__accordion__header__content__text">
              <ion-label>
                <ion-text
                  *ngIf="this.token.name"
                  class="eif__accordion__header__content__text__token-symbol ux-font-text-lg"
                  >{{ (this.token.name | splitString: ' - ')[0] }}</ion-text
                >
                <ion-text
                  *ngIf="this.token.name"
                  class="eif__accordion__header__content__text__token-name ux-font-text-base"
                  >{{ (this.token.name | splitString: ' - ')[1] }}</ion-text
                >
              </ion-label>
              <ion-badge class="ux-font-num-subtitulo">
                {{ this.apy | number: '1.2-2'
                }}{{ 'defi_investments.shared.expandable_investment_info.annual' | translate }}
              </ion-badge>
            </div>
          </div>
          <ion-icon
            slot="end"
            name="chevron-down"
            class="ion-accordion-toggle-icon"
            aria-hidden="true"
            role="img"
          ></ion-icon>
        </ion-item>
        <ion-list lines="none" slot="content" class="eif__accordion__content">
          <div class="eif__accordion__content__title">
            <ion-text class="ux-font-header-titulo"
              >{{ 'defi_investments.shared.expandable_investment_info.title' | translate }}
              {{ this.token.value }}</ion-text
            >
          </div>
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">
                {{ 'defi_investments.shared.expandable_investment_info.how_works' | translate }}
              </ion-text>
              <ion-text
                class="eif__accordion__content__information-item__info ux-font-text-base"
                [innerHTML]="this.infoText"
              ></ion-text>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">
                {{ 'defi_investments.shared.expandable_investment_info.protocol_type' | translate }}
              </ion-text>
              <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">
                {{ this.type }}
              </ion-text>
            </ion-label>
          </ion-item>
          <ion-item class="split-information-item">
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs">
                {{ 'defi_investments.shared.expandable_investment_info.receive_asset' | translate }}
              </ion-text>
              <div class="inline-image">
                <img [src]="this.token.logoRoute" />
                <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">
                  {{ this.token.value }}
                </ion-text>
              </div>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs">
                {{ 'defi_investments.shared.expandable_investment_info.blockchain' | translate }}
              </ion-text>
              <ion-badge [color]="this.networkColors[this.token.network]" class="ux-badge ux-font-num-subtitulo">{{
                this.token.network !== 'MATIC' ? this.token.network : ('Polygon' | uppercase)
              }}</ion-badge>
            </ion-label>
          </ion-item>
          <ion-item class="split-information-item">
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">
                {{ 'defi_investments.shared.expandable_investment_info.transaction_fee' | translate }}
              </ion-text>
              <div class="inline-image">
                <img [src]="this.nativeToken.logoRoute" />
                <ion-text class="eif__accordion__content__information-item__text ux-font-text-base ">
                  {{ this.nativeToken.value }}
                </ion-text>
              </div>
            </ion-label>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs">
                {{ 'defi_investments.shared.expandable_investment_info.withdrawal_fee' | translate }}
                <ion-icon (click)="showWithdrawInfo()" icon="information-circle"></ion-icon>
              </ion-text>
              <div class="inline-image">
                <img [src]="this.token.logoRoute" />
                <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">
                  {{ this.token.value }}
                </ion-text>
              </div>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">
                {{ 'defi_investments.shared.expandable_investment_info.information' | translate }}
              </ion-text>
              <div class="eif__accordion__content__information-item__button">
                <ion-button
                  name="go_to_defi_faqs"
                  (click)="this.goTo2pi()"
                  class="ux-link-xs"
                  appTrackClick
                  fill="clear"
                  size="small"
                >
                  {{ 'defi_investments.shared.expandable_investment_info.2pi_dashboard' | translate }}
                </ion-button>
              </div>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs">
                {{ 'defi_investments.shared.expandable_investment_info.profile' | translate }}
              </ion-text>
              <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">
                {{ this.profile | translate }}
              </ion-text>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-accordion>
    </ion-accordion-group>
  `,
  styleUrls: ['./expandable-investment-info.component.scss'],
})
export class ExpandableInvestmentInfoComponent implements OnInit {
  @Input() investmentProduct: InvestmentProduct;
  @Input() fbPrefix: string;
  token: Coin;
  nativeToken: Coin;
  tvl: number;
  apy: number;
  title: string;
  provider: string;
  type: string;
  mode: string;
  name: string;
  infoText: string;
  networkColors = NETWORK_COLORS;
  defiProducts: DefiProduct[];
  profile: string;
  url = LINKS.twoPiPage;
  isInfoModalOpen = false;
  trackClickName = 'display_product_info';

  constructor(
    private remoteConfig: RemoteConfigService,
    private modalController: ModalController,
    private translate: TranslateService,
    private browserService: BrowserService
  ) {}

  ngOnInit() {
    this.token = this.investmentProduct.token();
    this.nativeToken = this.investmentProduct.nativeToken();
    this.tvl = this.investmentProduct.tvl();
    this.apy = this.investmentProduct.apy();
    this.provider = this.investmentProduct.provider();
    this.type = this.investmentProduct.type();
    this.name = this.investmentProduct.name();
    this.getAvailableDefiProducts();
    this.setInvestmentInfo();
    this.trackClickName = this.fbPrefix && `${this.fbPrefix}_${this.trackClickName}`;
  }

  private getAvailableDefiProducts(): void {
    this.defiProducts = this.createAvailableDefiProducts().value();
    this.setProductProfile();
  }

  createAvailableDefiProducts(): AvailableDefiProducts {
    return new AvailableDefiProducts(this.remoteConfig);
  }

  goTo2pi() {
    this.browserService.open({ url: this.url });
  }

  setProductProfile() {
    const category = this.defiProducts.find((product) => product.id === this.name).category;
    this.profile = `defi_investments.shared.expandable_investment_info.profiles.${category}`;
  }

  private setInvestmentInfo() {
    this.title = 'defi_investments.shared.expandable_investment_info.title ' + this.token.value;
    this.infoText = this.translate.instant(
      `defi_investments.shared.expandable_investment_info.investment_info.${this.token.value}`
    );
  }

  async showWithdrawInfo() {
    if (this.isInfoModalOpen === false) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: WithdrawInfoModalComponent,
        componentProps: {},
        cssClass: 'ux-modal-withdraw-info',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }
}
