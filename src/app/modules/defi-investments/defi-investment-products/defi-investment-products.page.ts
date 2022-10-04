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
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { GraphqlService } from '../../wallets/shared-wallets/services/graphql/graphql.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

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
      <div class="dp__subheader">
        <div class="dp__subheader__title ux-font-num-subtitulo">
          <ion-text>
            {{ 'defi_investments.defi_investment_products.total_invested' | translate }}
          </ion-text>
        </div>
        <div class="dp__spinner-and-amount ux-font-num-titulo">
          <ion-spinner color="white" name="crescent" *ngIf="!this.allLoaded"></ion-spinner>
          <div class="dp__amount">
            <div class="dp__amount__content">
              <ion-text class="dp__amount__content__total-invested" *ngIf="this.allLoaded">
                {{ this.totalInvested ?? 0.0 | number: '1.2-2' }}
              </ion-text>
              <ion-text class="ux-font-text-lg" *ngIf="this.allLoaded">USD</ion-text>
            </div>
          </div>
        </div>
      </div>
      <div class="header-background"></div>
      <div class="dp">
        <div class="dp__active-card">
          <ion-item lines="none" slot="header">
            <ion-label>{{ 'defi_investments.defi_investment_products.title_investments' | translate }}</ion-label>
          </ion-item>
          <div *ngIf="!this.activeInvestments.length && !this.allLoaded">
            <app-defi-investment-product-skeleton></app-defi-investment-product-skeleton>
          </div>
          <div class="dp__no_investments" *ngIf="!this.activeInvestments.length && this.allLoaded">
            <img src="assets/img/defi-investments/no-investments.svg" />
            <ion-text class="ux-font-text-xs" color="neutral80">{{
              'defi_investments.defi_investment_products.no_investments' | translate
            }}</ion-text>
          </div>
          <ion-text
            class="dp__gains ux-font-text-xs"
            *ngIf="this.activeInvestments.length && this.activeInvestmentsContinuousEarning.length"
            >{{ 'defi_investments.defi_investment_products.profits' | translate }}</ion-text
          >
          <div class="dp__balance_items" *ngFor="let investment of this.activeInvestmentsContinuousEarning">
            <app-investment-balance-item [investmentProduct]="investment.product" [balance]="investment.balance">
            </app-investment-balance-item>
          </div>
          <ion-text
            class="dp__weeklygains ux-font-text-xs"
            *ngIf="this.activeInvestments.length && this.activeInvestmentsWeaklyEarning.length"
            >{{ 'defi_investments.defi_investment_products.profits_weekly' | translate }}</ion-text
          >
          <div *ngFor="let investment of this.activeInvestmentsWeaklyEarning">
            <app-investment-balance-item [investmentProduct]="investment.product" [balance]="investment.balance">
            </app-investment-balance-item>
          </div>
        </div>
        <div class="dp__available-card">
          <ion-item lines="none" slot="header">
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
            <app-filter-tab [items]="this.items" controlName="profile"></app-filter-tab>
          </form>
          <div *ngIf="!this.availableInvestments.length" class="dp__empty">
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
            *ngFor="let investment of this.availableInvestments"
            [investmentProduct]="investment.product"
            [isComing]="investment.isComing"
            [continuousEarning]="investment.continuousEarning"
            [showFooter]="investment.balance !== null"
          ></app-defi-investment-product>
        </div>
      </div>
      <div class="dp__link">
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
      <app-choose-investor-profile-card
        [hasDoneInvestorTest]="this.hasDoneInvestorTest"
      ></app-choose-investor-profile-card>
    </ion-content>
  `,
  styleUrls: ['./defi-investment-products.page.scss'],
})
export class DefiInvestmentProductsPage {
  defiProducts: DefiProduct[];
  address: string;
  totalInvested: number;
  allDefiProducts: DefiInvestment[] = [];
  investorCategory: string;
  disableFaqsButton = true;
  pids = [];
  profileForm: UntypedFormGroup = this.formBuilder.group({
    profile: ['conservative', []],
  });
  items = [
    {
      title: 'wealth_managements.about_investor_profile.conservative_profile.title',
      value: 'conservative',
      dataToTrack: 'ux_invest_conservative',
    },
    {
      title: 'wealth_managements.about_investor_profile.moderated_profile.title',
      value: 'medium',
      dataToTrack: 'ux_invest_moderate',
    },
    {
      title: 'wealth_managements.about_investor_profile.aggressive_profile.title',
      value: 'risky',
      dataToTrack: 'ux_invest_aggressive',
    },
  ];
  activeInvestments: DefiInvestment[] = [];
  activeInvestmentsContinuousEarning: DefiInvestment[] = [];
  activeInvestmentsWeaklyEarning: DefiInvestment[] = [];
  availableInvestments: DefiInvestment[] = [];
  filteredAvailableInvestments: DefiInvestment[] = [];
  allLoaded = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiWalletService: ApiWalletService,
    private apiUsuariosService: ApiUsuariosService,
    private twoPiApi: TwoPiApi,
    private walletEncryptionService: WalletEncryptionService,
    private walletService: WalletService,
    private navController: NavController,
    private remoteConfig: RemoteConfigService,
    private graphql: GraphqlService,
    private storageService: StorageService,
  ) {}

  get hasDoneInvestorTest(): boolean {
    return this.investorCategory !== 'wealth_managements.profiles.no_category';
  }

  ionViewDidLeave() {
    this.emptyArrays();
    this.cleanValues();
  }

  cleanValues() {
    this.allLoaded = false;
    this.profileForm.get('profile').setValue('conservative');
  }

  ionViewWillEnter() {
    this.getUser();
    this.profileForm.get('profile').valueChanges.subscribe((value) => this.filterByInvestorCategory(value));
  }

  async ionViewDidEnter() {
    this.getUserWalletAddress();
    this.getAvailableDefiProducts();
    await this.getInvestments();
    this.filterByInvestorCategory(this.profileForm.value.profile);
    await this.setBalance();
    this.setFilter(this.investorCategory);
    this.allLoaded = true;
  }

  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    if (wallet) this.address = wallet.addresses.MATIC;
  }

  calculatedTotalBalanceInvested() {
    this.totalInvested = 0;
    for (const pid of this.pids) {
      this.graphql.getInvestedBalance(this.address, pid).subscribe(({ data }) => {
        if (data.flows[0]) {
          const balance = parseFloat(data.flows[0].balanceUSD);
          this.totalInvested += balance;
        }
      });
    }
  }

  getUser() {
    this.apiUsuariosService.getUser(false).subscribe((user) => {
      this.investorCategory = user.profile.investor_category;
    });
  }

  goToDefiFaqs() {
    this.navController.navigateForward(['/support/faqs/wallet_operations']);
  }

  filterByInvestorCategory(category: string) {
    const investmentsToFilter = this.allDefiProducts.filter(
      (investment) => investment.balance === 0 || investment.balance === null
    );
    if (category === 'no_category') {
      this.availableInvestments = investmentsToFilter.filter((investment) => investment.category === 'conservative');
      this.profileForm.patchValue({ profile: 'conservative' });
    }
    this.availableInvestments = investmentsToFilter.filter((investment) => investment.category === category);
  }

  setFilter(investorProfile: string) {
    this.profileForm.patchValue({ profile: investorProfile.replace('wealth_managements.profiles.', '') });
  }

  emptyArrays() {
    this.availableInvestments = [];
    this.activeInvestments = [];
    this.allDefiProducts = [];
    this.activeInvestmentsContinuousEarning = [];
    this.activeInvestmentsWeaklyEarning = [];
  }

  private getAvailableDefiProducts(): void {
    this.defiProducts = this.createAvailableDefiProducts().value();
  }

  createAvailableDefiProducts(): AvailableDefiProducts {
    return new AvailableDefiProducts(this.remoteConfig);
  }

  async getInvestments() {
    const investmentsProducts = [];
    this.pids = [];
    for (const product of this.defiProducts) {
      const anInvestmentProduct = await this.getInvestmentProduct(product);
      investmentsProducts.push({
        product: anInvestmentProduct,
        balance: null,
        isComing: product.isComing,
        continuousEarning: product.continuousEarning,
        category: product.category,
      });
      this.pids.push(anInvestmentProduct.id());
    }
    this.allDefiProducts = this.availableInvestments = investmentsProducts;
    this.calculatedTotalBalanceInvested();
  }

  async setBalance() {
    const walletExist = await this.walletService.walletExist();
    const investments = [];
    for (const dp of this.allDefiProducts) {
      const balance = walletExist ? await this.getProductBalance(dp.product) : 0;
      investments.push({
        product: dp.product,
        balance: balance,
        isComing: dp.isComing,
        continuousEarning: dp.continuousEarning,
        category: dp.category,
      });
    }
    this.allDefiProducts = investments;
    this.filterUserInvestments();
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

  filterUserInvestments(): void {
    this.activeInvestments = this.allDefiProducts.filter((investment) => investment.balance > 0);
    this.activeInvestmentsContinuousEarning = this.activeInvestments.filter(
      (investment) => investment.continuousEarning === true
    );
    this.activeInvestmentsWeaklyEarning = this.activeInvestments.filter(
      (investment) => investment.continuousEarning === false
    );
    this.availableInvestments = this.allDefiProducts.filter((investment) => investment.balance === 0);
    this.filterByInvestorCategory(this.profileForm.value.profile);
  }

  async getInvestmentProduct(product: DefiProduct): Promise<TwoPiProduct> {
    return new TwoPiProduct(await this.twoPiApi.vault(product.id), this.apiWalletService);
  }
}
