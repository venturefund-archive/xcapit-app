import { InvestmentProduct } from '../shared-defi-investments/interfaces/investment-product.interface';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { TwoPiInvestment } from '../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { Component } from '@angular/core';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DefiInvestment } from '../shared-defi-investments/interfaces/defi-investment.interface';
import { DefiProduct } from '../shared-defi-investments/interfaces/defi-product.interface';
import { AvailableDefiProducts } from '../shared-defi-investments/models/available-defi-products/available-defi-products.model';
import { TwoPiApi } from '../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { TwoPiProduct } from '../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { VoidSigner } from 'ethers';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { ApiUsuariosService } from '../../users/shared-users/services/api-usuarios/api-usuarios.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-defi-investment-products',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-title class="ion-text-center">{{
          'defi_investments.defi_investment_products.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="header-background"></div>
      <div class="dp">
        <div class="dp__active-card" *ngIf="this.activeInvestments.length">
          <ion-item lines="none" slot="header">
            <ion-label>{{ 'defi_investments.defi_investment_products.title_investments' | translate }}</ion-label>
          </ion-item>
          <app-investment-balance-item
            *ngFor="let investment of this.activeInvestments"
            [investmentProduct]="investment.product"
            [balance]="investment.balance"
          ></app-investment-balance-item>
          <!-- <div class="dp__weekly-profit-disclaimer" *ngIf="this.activeInvestments.length">
            <ion-label class=" ux-font-text-xxs" color="neutral80">
              {{ 'defi_investments.shared.defi_investment_product.daily_earnings_disclaimer_active' | translate }}
            </ion-label>
          </div> -->
        </div>
        <div
          class="dp__available-card-skeleton"
          *ngIf="!this.activeInvestments.length && !this.availableInvestments.length"
        >
          <ion-skeleton-text
            class="skeleton"
            style="width:55%"
            *ngIf="!this.activeInvestments.length && !this.availableInvestments.length"
            slot="header"
            animated
          ></ion-skeleton-text>
          <div>
            <app-defi-investment-product-skeleton *ngFor="let i of [1, 2, 3]"></app-defi-investment-product-skeleton>
          </div>
        </div>
        <div class="dp__available-card" *ngIf="this.availableInvestments.length">
          <ion-item
            *ngIf="this.activeInvestments.length || this.availableInvestments.length"
            lines="none"
            slot="header"
          >
            <ion-label
              >{{
                (!this.activeInvestments.length
                  ? 'defi_investments.defi_investment_products.title'
                  : 'defi_investments.defi_investment_products.recommendations'
                ) | translate
              }}
            </ion-label>
          </ion-item>
          <form [formGroup]="this.profileForm">
            <app-filter-tab 
              [items]="this.items"
              controlName="profile"
            ></app-filter-tab>
          </form>
          <div *ngIf="!this.filteredAvailableInvestments.length" class="dp__empty">
            <div class="dp__empty__image text-center">
              <img src="assets/img/defi-investments/empty-products.svg" />
            </div>
            <div class="dp__empty__text">
              <ion-text class="ux-font-text-xs">
                {{ 'defi_investments.defi_investment_products.empty_products' | translate }}
              </ion-text>
            </div>
          </div>
          <app-defi-investment-product
            *ngFor="let investment of this.filteredAvailableInvestments"
            [investmentProduct]="investment.product"
            [isComing]="investment.isComing"
            [continuousEarning]="investment.continuousEarning"
          ></app-defi-investment-product>
          <!-- <div
            class="dp__weekly-profit-disclaimer"
            *ngIf="!this.activeInvestments.length && this.filteredAvailableInvestments.length"
          >
            <ion-label class=" ux-font-text-xxs" color="neutral80">
              {{ 'defi_investments.shared.defi_investment_product.daily_earnings_disclaimer_available' | translate }}
            </ion-label>
          </div> -->
        </div>
      </div>
      <div *ngIf="this.activeInvestments.length || this.availableInvestments.length" class="dp__link">
        <ion-button
          name="go_to_defi_faqs"
          (click)="this.goToDefiFaqs()"
          class="link ux-link-xs"
          appTrackClick
          fill="clear"
          size="small"
        >
          {{ 'defi_investments.defi_investment_products.link_button' | translate }}
        </ion-button>
      </div>
      <div *ngIf="!this.activeInvestments.length && !this.availableInvestments.length">
        <app-choose-investor-profile-skeleton></app-choose-investor-profile-skeleton>
      </div>
      <app-choose-investor-profile-card
        [hasDoneInvestorTest]="this.hasDoneInvestorTest"
        *ngIf="this.activeInvestments.length || this.availableInvestments.length"
      ></app-choose-investor-profile-card>
    </ion-content>
  `,
  styleUrls: ['./defi-investment-products.page.scss'],
})
export class DefiInvestmentProductsPage {
  defiProducts: DefiProduct[];
  investorCategory: string;
  profileForm: FormGroup = this.formBuilder.group({
    profile: ['conservative', []],
  });
  items = [
    {
      title: 'wealth_managements.about_investor_profile.conservative_profile.title',
      value: 'conservative',
      dataToTrack: 'ux_invest_conservative'
    },
    {
      title: 'wealth_managements.about_investor_profile.moderated_profile.title',
      value: 'medium',
      dataToTrack: 'ux_invest_moderate'
    },
    {
      title: 'wealth_managements.about_investor_profile.aggressive_profile.title',
      value: 'risky',
      dataToTrack: 'ux_invest_aggressive'
    },
  ];
  activeInvestments: DefiInvestment[] = [];
  availableInvestments: DefiInvestment[] = [];
  filteredAvailableInvestments: DefiInvestment[] = [];
  haveInvestments = true;
  constructor(
    private formBuilder: FormBuilder,
    private apiWalletService: ApiWalletService,
    private apiUsuariosService: ApiUsuariosService,
    private twoPiApi: TwoPiApi,
    private walletEncryptionService: WalletEncryptionService,
    private walletService: WalletService,
    private navController: NavController
  ) {}

  get hasDoneInvestorTest(): boolean {
    return this.investorCategory !== 'wealth_managements.profiles.no_category';
  }

  ionViewDidLeave() {
    this.emptyArrays();
  }

  ionViewWillEnter() {
    this.getUser();
    this.profileForm.get('profile').valueChanges.subscribe((value) => this.filterByInvestorCategory(value));
  }

  async ionViewDidEnter() {
    this.getAvailableDefiProducts();
    await this.getInvestments();
  }

  getUser() {
    this.apiUsuariosService.getUser(false).subscribe((user) => {
      this.investorCategory = user.profile.investor_category;
    });
  }

  goToDefiFaqs() {
    this.navController.navigateForward(['/support/defi']);
  }

  filterByInvestorCategory(category: string) {
    if (category === 'no_category') {
      this.filteredAvailableInvestments = this.availableInvestments.filter(
        (investment) => investment.category === 'conservative'
      );
      this.profileForm.patchValue({ profile: 'conservative' });
    }
    this.filteredAvailableInvestments = this.availableInvestments.filter(
      (investment) => investment.category === category
    );
  }

  setFilter(investorProfile: string) {
    this.profileForm.patchValue({ profile: investorProfile.replace('wealth_managements.profiles.', '') });
    this.filterByInvestorCategory(this.profileForm.value.profile);
  }

  emptyArrays() {
    this.availableInvestments = [];
    this.activeInvestments = [];
  }

  private getAvailableDefiProducts(): void {
    this.defiProducts = this.createAvailableDefiProducts().value();
  }

  createAvailableDefiProducts(): AvailableDefiProducts {
    return new AvailableDefiProducts();
  }

  async getInvestments(): Promise<void> {
    const investments: DefiInvestment[] = [];
    const walletExist = await this.walletService.walletExist();
    for (const product of this.defiProducts) {
      const investmentProduct = await this.getInvestmentProduct(product);
      const balance = walletExist ? await this.getProductBalance(investmentProduct) : 0;
      investments.push({
        product: investmentProduct,
        balance: balance,
        isComing: product.isComing,
        continuousEarning: product.continuousEarning,
        category: product.category,
      });
    }
    this.filterUserInvestments(investments);
  }

  async getProductBalance(investmentProduct: InvestmentProduct): Promise<number> {
    const wallet = await this.walletEncryptionService.getEncryptedWallet();
    const address = wallet.addresses[investmentProduct.token().network];
    const investment = this.createInvestment(investmentProduct, address);
    return await investment.balance();
  }

  createInvestment(investmentProduct: InvestmentProduct, address: string): TwoPiInvestment {
    return TwoPiInvestment.create(investmentProduct, new VoidSigner(address), this.apiWalletService);
  }

  filterUserInvestments(investments: DefiInvestment[]): void {
    this.activeInvestments = investments.filter((investment) => investment.balance > 0);
    this.availableInvestments = investments.filter((investment) => investment.balance === 0);
    this.setFilter(this.investorCategory);
  }

  async getInvestmentProduct(product: DefiProduct): Promise<TwoPiProduct> {
    return new TwoPiProduct(await this.twoPiApi.vault(product.id), this.apiWalletService);
  }
}
