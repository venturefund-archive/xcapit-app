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
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';

@Component({
  selector: 'app-defi-investment-products',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
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
          <div class="dp__weekly-profit-disclaimer" *ngIf="this.activeInvestments.length">
            <ion-label class=" ux-font-text-xxs" color="uxsemidark">
              {{ 'defi_investments.shared.defi_investment_product.weekly_earnings_disclaimer_active' | translate }}
            </ion-label>
          </div>
        </div>
        <div class="dp__available-card">
          <ion-skeleton-text
            class="skeleton"
            style="width:55%"
            *ngIf="!this.activeInvestments.length && !this.availableInvestments.length"
            slot="header"
            animated
          ></ion-skeleton-text>
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
          <div *ngIf="this.activeInvestments.length || this.availableInvestments.length">
            <app-defi-investment-product
              *ngFor="let investment of this.availableInvestments"
              [investmentProduct]="investment.product"
              [isComing]="investment.isComing"
              [weeklyEarning]="investment.weeklyEarning"
            ></app-defi-investment-product>
          </div>
          <div
            class="dp__weekly-profit-disclaimer"
            *ngIf="!this.activeInvestments.length && this.availableInvestments.length"
          >
            <ion-label class=" ux-font-text-xxs" color="uxsemidark">
              {{ 'defi_investments.shared.defi_investment_product.weekly_earnings_disclaimer_available' | translate }}
            </ion-label>
          </div>
          <div *ngIf="!this.activeInvestments.length && !this.availableInvestments.length">
            <app-defi-investment-product-skeleton *ngFor="let i of [1, 2, 3]"></app-defi-investment-product-skeleton>
          </div>
        </div>
      </div>
      <div *ngIf="!this.activeInvestments.length && !this.availableInvestments.length">
        <app-choose-investor-profile-skeleton></app-choose-investor-profile-skeleton>
      </div>
      <!-- <app-choose-investor-profile-card [hasDoneInvestorTest]="this.hasDoneInvestorTest" *ngIf="this.activeInvestments.length || this.availableInvestments.length"></app-choose-investor-profile-card> -->
    </ion-content>
  `,
  styleUrls: ['./defi-investment-products.page.scss'],
})
export class DefiInvestmentProductsPage {
  defiProducts: DefiProduct[];
  investorCategory: string;
  constructor(
    private apiWalletService: ApiWalletService,
    private apiUsuariosService: ApiUsuariosService,
    private twoPiApi: TwoPiApi,
    private walletEncryptionService: WalletEncryptionService,
    private walletService: WalletService
  ) {}
  activeInvestments: DefiInvestment[] = [];
  availableInvestments: DefiInvestment[] = [];
  haveInvestments = true;

  get hasDoneInvestorTest(): boolean {
    return this.investorCategory !== 'wealth_managements.profiles.no_category';
  }

  ionViewDidLeave() {
    this.emptyArrays();
  }

  ionViewWillEnter() {
    this.getUser();
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
        weeklyEarning: product.weeklyEarning,
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
  }

  async getInvestmentProduct(product: DefiProduct): Promise<TwoPiProduct> {
    return new TwoPiProduct(await this.twoPiApi.vault(product.id), this.apiWalletService);
  }
}
