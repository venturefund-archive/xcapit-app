import { InvestmentProduct } from '../shared-defi-investments/interfaces/investment-product.interface';
import { TwoPiInvestment } from '../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { Component } from '@angular/core';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DefiInvestment } from '../shared-defi-investments/interfaces/defi-investment.interface';
import { DefiProduct } from '../shared-defi-investments/interfaces/defi-product.interface';
import { AvailableDefiProducts } from '../shared-defi-investments/models/available-defi-products/available-defi-products.model';
import { TwoPiApi } from '../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { TwoPiProduct } from '../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { VoidSigner } from 'ethers';
import { ApiUsuariosService } from '../../users/shared-users/services/api-usuarios/api-usuarios.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { GraphqlService } from '../../wallets/shared-wallets/services/graphql/graphql.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { YieldCalculator } from '../shared-defi-investments/models/yield-calculator/yield-calculator.model';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RawAmount } from '../../swaps/shared-swaps/models/amount-of/amount-of';
import { TotalInvestedBalanceOfInjectable } from '../shared-defi-investments/models/total-invested-balance-of/injectable/total-invested-balance-of.injectable';
import { InvestedBalanceOfInjectable } from '../shared-defi-investments/models/invested-balance-of/injectable/invested-balance-of.injectable';
import { RawInvestmentProfile } from '../shared-defi-investments/types/raw-investment-profile.type';
import { InvestmentProfiles } from '../shared-defi-investments/models/investment-profile/investment-profiles';

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
    <ion-content [style]="this.contentFixedStyle">
      <div class="dp__subheader">
        <div class="dp__subheader__title ux-font-num-subtitulo">
          <ion-text>
            {{ 'defi_investments.defi_investment_products.total_invested' | translate }}
          </ion-text>
        </div>
        <div class="dp__spinner-and-amount ux-font-num-titulo">
          <ion-spinner color="white" name="crescent" *ngIf="this.totalInvested === undefined"></ion-spinner>
          <div class="dp__amount">
            <div class="dp__amount__content">
              <ion-text class="dp__amount__content__total-invested" *ngIf="this.totalInvested !== undefined">
                {{ this.totalInvested | number: '1.2-2' }}
              </ion-text>
              <ion-text class="ux-font-text-lg" *ngIf="this.totalInvested !== undefined">USD</ion-text>
            </div>
          </div>
        </div>
      </div>
      <div class="header-background"></div>
      <div class="cumulative-total-yields">
        <app-cumulative-total-yields
          [totalUsdYield]="this.totalUsdYield"
          [allLoaded]="this.allLoaded"
        ></app-cumulative-total-yields>
      </div>
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
          <form [formGroup]="this.profileForm" *ngIf="this.investmentProfiles">
            <app-filter-tab [items]="this.investmentProfiles" controlName="profile"></app-filter-tab>
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
            [investment]="investment"
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
  private price$: Observable<any>;
  private movements$: Observable<any>[];
  private products: DefiProduct[];
  private investments: DefiInvestment[] = [];
  private address: string;
  private defaultInvestmentProfile = 'wealth_managements.profiles.conservative';
  totalInvested: number;
  investmentProfiles: RawInvestmentProfile[];
  activeInvestments: DefiInvestment[] = [];
  activeInvestmentsContinuousEarning: DefiInvestment[] = [];
  activeInvestmentsWeaklyEarning: DefiInvestment[] = [];
  availableInvestments: DefiInvestment[] = [];
  allLoaded = false;
  totalUsdYield: RawAmount = { value: 0, token: 'USD' };
  contentFixedStyle = 'display: none';
  hasDoneInvestorTest = false;
  profileForm: UntypedFormGroup = this.formBuilder.group({
    profile: ['conservative', []],
  });

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiWalletService: ApiWalletService,
    private apiUsuariosService: ApiUsuariosService,
    private twoPiApi: TwoPiApi,
    private navController: NavController,
    private remoteConfig: RemoteConfigService,
    private graphql: GraphqlService,
    private storageService: StorageService,
    private totalInvestedBalanceOf: TotalInvestedBalanceOfInjectable,
    private investedBalanceOf: InvestedBalanceOfInjectable
  ) {}

  ionViewWillEnter() {
    this.getUser();
    this.profileForm.get('profile').valueChanges.subscribe((value) => this._filterByInvestorCategory(value));
  }

  async ionViewDidEnter() {
    this.contentFixedStyle = 'display: inherit';
    this.setInvestmentProfiles();
    await this.getUserWalletAddress();
    this.setAvailableProducts();
    await this.setInvestments();
    this.setInvestedBalance();
    this._filterByInvestorCategory(this.profileForm.value.profile);
    this.setBalanceAndCalculateEarnings();
  }

  private setInvestmentProfiles() {
    this.investmentProfiles = new InvestmentProfiles().all();
  }

  private async setBalanceAndCalculateEarnings() {
    await this.setBalance();
    this.getPrices();
    this.getAllMovements();
    this.filterUserInvestments();
    this.calculateEarnings();
    this.setFilter(this.defaultInvestmentProfile);
    this.allLoaded = true;
  }

  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    this.address = wallet.addresses.MATIC;
  }

  getAllMovementsForProduct(dp: DefiInvestment) {
    this.movements$.push(
      this.graphql.getAllMovements(this.address, dp.product.id()).pipe(
        map((data) => {
          return { movements: data, product: dp.product };
        })
      )
    );
  }

  calculateEarnings() {
    forkJoin([this.price$, ...this.movements$]).subscribe((res) => {
      this.activeInvestments.forEach((ai) => {
        const calculator = new YieldCalculator(
          ai.balance,
          res.find((res) => res.product?.id() === ai.product.id()).movements.data.flows,
          ai.product.token().value,
          res[0].prices[ai.product.token().value],
          ai.product.decimals()
        );
        const usdYield = calculator.cumulativeYieldUSD();
        this.totalUsdYield.value += usdYield.value;
      });
    });
  }

  getPrices() {
    const tokens = this.investments.map((value: DefiInvestment) => value.product.token().value);
    this.price$ = this.apiWalletService.getPrices(tokens, false);
  }

  getAllMovements() {
    this.movements$ = [];
    this.investments.forEach((dp: DefiInvestment) => this.getAllMovementsForProduct(dp));
  }

  getUser() {
    this.apiUsuariosService.getUser(false).subscribe((user) => {
      if (!user.profile.investor_category.includes('no_category') && user.profile.investor_category) {
        this.defaultInvestmentProfile = user.profile.investor_category;
        this.hasDoneInvestorTest = true;
      }
    });
  }

  goToDefiFaqs() {
    this.navController.navigateForward(['/support/faqs/wallet_operations']);
  }

  private _filterByInvestorCategory(category: string) {
    this.availableInvestments = this.investments
      .filter((investment) => this._withoutBalance(investment))
      .filter((investment) => investment.category === category);
  }

  private _withoutBalance(investment: DefiInvestment) {
    return investment.balance === 0 || investment.balance === null;
  }

  setFilter(investorProfile: string) {
    this.profileForm.patchValue({ profile: investorProfile?.replace('wealth_managements.profiles.', '') });
  }

  emptyArrays() {
    this.availableInvestments = [];
    this.activeInvestments = [];
    this.investments = [];
    this.activeInvestmentsContinuousEarning = [];
    this.activeInvestmentsWeaklyEarning = [];
    this.totalUsdYield.value = 0;
  }

  private setAvailableProducts(): void {
    this.products = this.createAvailableDefiProducts().value();
  }

  createAvailableDefiProducts(): AvailableDefiProducts {
    return new AvailableDefiProducts(this.remoteConfig);
  }

  async setInvestments() {
    const investmentsProducts = [];
    for (const product of this.products) {
      const anInvestmentProduct = await this.getInvestmentProduct(product);
      investmentsProducts.push({
        product: anInvestmentProduct,
        balance: (await this.investedBalanceOf.create(this.address, anInvestmentProduct).cached()).balance(),
        isComing: product.isComing,
        continuousEarning: product.continuousEarning,
        category: product.category,
      });
    }
    this.investments = this.availableInvestments = investmentsProducts;
  }

  private _products(): TwoPiProduct[] {
    return this.investments.map((investment) => investment.product as TwoPiProduct);
  }

  async setInvestedBalance() {
    const totalInvestedBalanceOf = this.totalInvestedBalanceOf.create(this.address, this._products());
    this.totalInvested = await totalInvestedBalanceOf.cached();
    this.totalInvested = await totalInvestedBalanceOf.value();
  }

  async setBalance() {
    const investments = [];
    for (const investment of this.investments) {
      investments.push({
        product: investment.product,
        balance: (
          await this.investedBalanceOf.create(this.address, investment.product as TwoPiProduct).value()
        ).balance(),
        isComing: investment.isComing,
        continuousEarning: investment.continuousEarning,
        category: investment.category,
      });
    }
    this.investments = investments;
  }

  createInvestment(investmentProduct: InvestmentProduct, address: string): TwoPiInvestment {
    return TwoPiInvestment.create(investmentProduct, new VoidSigner(address), this.apiWalletService);
  }

  filterUserInvestments(): void {
    this.activeInvestments = this.investments.filter((investment) => investment.balance > 0);
    this.activeInvestmentsContinuousEarning = this.activeInvestments.filter(
      (investment) => investment.continuousEarning === true
    );
    this.activeInvestmentsWeaklyEarning = this.activeInvestments.filter(
      (investment) => investment.continuousEarning === false
    );
    this.availableInvestments = this.investments.filter((investment) => investment.balance === 0);

    this._filterByInvestorCategory(this.profileForm.value.profile);
  }

  async getInvestmentProduct(product: DefiProduct): Promise<TwoPiProduct> {
    return new TwoPiProduct(await this.twoPiApi.vault(product.id), this.apiWalletService);
  }

  cleanValues() {
    this.totalInvested = 0;
    this.allLoaded = false;
    this.profileForm.get('profile').setValue('conservative');
  }

  ionViewDidLeave() {
    this.emptyArrays();
    this.cleanValues();
  }
}
