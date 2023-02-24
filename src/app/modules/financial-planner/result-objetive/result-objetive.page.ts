import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { TwoPiApi } from '../../defi-investments/shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { TwoPiProduct } from '../../defi-investments/shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { environment } from 'variables.env';
import { NONPROD_DEFI_PRODUCTS, PROD_DEFI_PRODUCTS } from '../shared-financial-planner/constants/products';
import { ToastWithButtonsComponent } from '../../../shared/components/toast-with-buttons/toast-with-buttons.component';

@Component({
  selector: 'app-result-objetive',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded no-border">
        <ion-buttons slot="start">
          <ion-back-button class="content__back" defaultHref="/financial-planner/objetive-info"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'financial_planner.objetive_info.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div *ngIf="this.data" class="objetive-card">
        <app-objetive-card [icon]="this.icon" [category]="this.category" [necessaryAmount]="this.necessaryAmount" [name]="this.name"></app-objetive-card>
      </div>
      <div class="content">
        <div class="content__title">
          <ion-text class="ux-font-text-lg">{{ 'financial_planner.result_objetive.saving' | translate }}</ion-text>
        </div>
        <div class="content__description">
          <ion-text class="ux-font-text-base">{{ this.savingText }}</ion-text>
        </div>
        <div class="content__title">
          <ion-text class="ux-font-text-lg">{{ 'financial_planner.result_objetive.invest' | translate }}</ion-text>
        </div>
        <div class="content__description">
          <ion-text class="ux-font-text-base">{{
            'financial_planner.result_objetive.invest_description' | translate
          }}</ion-text>
        </div>
        <div class="content__invest">
          <div class="content__invest__cards" *ngFor="let product of products">
            <div class="ux-card content__invest__invest-card">
              <div class="img">
                <img [src]="product.img" />
              </div>
              <div>
                <div class="title">
                  <ion-text class="ux-font-text-lg">{{ product.title }}</ion-text>
                </div>
                <div class="description">
                  <ion-text class="ux-font-text-xs">{{ product.description }}</ion-text>
                </div>
                <div class="badge">
                  <ion-badge class="ux-font-num-subtitulo ux-badge-coming"
                    >{{ product.apy | number: '1.2-2'
                    }}{{ 'financial_planner.result_objetive.annual' | translate }}</ion-badge
                  >
                </div>
              </div>
            </div>
            <img src="assets/ux-icons/ux-circle-row.svg" />
            <div class="ux-card content__invest__invest-card-week">
              <ion-text class="ux-font-text-lg"
                >{{ product.weeks }} {{ 'financial_planner.result_objetive.weeks' | translate }}</ion-text
              >
            </div>
          </div>
        </div>
        <div class="content__disclaimer">
          <ion-text class="ux-font-text-xxs">{{ 'financial_planner.result_objetive.disclaimer' | translate }}</ion-text>
        </div>
        <div class="content__button">
          <ion-button
            class="ux_button"
            appTrackClick
            name="ux_financial_planner_go_to_investments"
            color="secondary"
            expand="block"
            (click)="this.goToInvestmentDefi()"
          >
            {{ 'financial_planner.result_objetive.start_invest_button' | translate }}
          </ion-button>
        </div>
        <div class="content__button-secondary">
          <ion-button
            appTrackClick
            name="ux_financial_planner_back_to_start"
            class="ux_button ion-no-padding"
            size="small"
            fill="clear"
            color="info"
            (click)="this.goToHome()"
          >
            {{ 'financial_planner.result_objetive.back_button' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./result-objetive.page.scss'],
})
export class ResultObjetivePage implements OnInit {
  data: any;
  savingText: string;
  weeks: number;
  saving: number;
  products;
  icon: string;
  category: string;
  name: string;
  necessaryAmount: number;
  env = environment.environment;
  isOpen = false;

  constructor(
    private appStorage: AppStorageService,
    private translate: TranslateService,
    private navController: NavController,
    private apiWalletService: ApiWalletService,
    private twoPiApi: TwoPiApi,
    private modalController: ModalController,
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    this.products = this.env === 'PRODUCCION' ? PROD_DEFI_PRODUCTS : NONPROD_DEFI_PRODUCTS;
    await this.getPlannerData();
    this.calculationsSaving();
    await this.calcuteAPYs();
    this.calculationsInvesting();
  }

  async getPlannerData() {
    this.data = await this.appStorage.get('planner_data');
    this.setData()
  }
  
  setData(){
    this.name = this.data.name;
    this.necessaryAmount = this.data.necessaryAmount;
    this.icon = `assets/img/financial-planner/categories/${this.data.category}.svg`;
    this.category = `financial_planner.shared_financial_planner.objetive_card.categories.${this.data.category}`;
  }

  calculationsSaving() {
    this.saving = this.data.income - this.data.expenses;
    this.weeks = Math.round(this.data.necessaryAmount / (this.saving / 4));
    this.savingText = this.translate.instant('financial_planner.result_objetive.saving_description', {
      saving: this.saving,
      weeks: this.weeks,
    });
  }

  calculationsInvesting() {
    for (const product of this.products) {
      product.weeks = Math.round(this.weeks / (1 * (1 + product.apy / 55)));
      if (product.weeks > 500 && this.isOpen == false) {
        this.isOpen = true;
        this.openModalMoreThan500Weeks();
      }
    }
  }

  goToInvestmentDefi() {
    this.navController.navigateForward(['/tabs/investments']);
  }

  goToHome() {
    this.navController.navigateForward(['/tabs/home']);
  }

  async calcuteAPYs() {
    for (const product of this.products) {
      const investmentProduct = await this.getInvestmentProduct(product);
      product.apy = investmentProduct.apy();
    }
  }

  async getInvestmentProduct(product: any): Promise<TwoPiProduct> {
    return new TwoPiProduct(await this.twoPiApi.vault(product.id), this.apiWalletService);
  }

  async openModalMoreThan500Weeks() {
    const modal = await this.modalController.create({
      component: ToastWithButtonsComponent,
      cssClass: 'ux-toast-warning',
      showBackdrop: false,
      componentProps: {
        text: this.translate.instant('financial_planner.result_objetive.informative_modal'),
        primaryButtonText: this.translate.instant('financial_planner.result_objetive.informative_modal_button'),
        primaryButtonRoute: '/financial-planner/new-objetive',
      },
    });
    modal.present();
    this.isOpen = false;
  }

  
}
