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
      <div class="header-background" *ngIf="this.activeInvestments.length || this.availableInvestments.length"></div>
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
        </div>
        <div class="dp__available-card" *ngIf="this.availableInvestments.length">
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
          <app-defi-investment-product
            *ngFor="let investment of this.availableInvestments"
            [investmentProduct]="investment.product"
            [isComing]="investment.isComing"
          ></app-defi-investment-product>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./defi-investment-products.page.scss'],
})
export class DefiInvestmentProductsPage {
  defiProducts: DefiProduct[];
  constructor(
    private apiWalletService: ApiWalletService,
    private twoPiApi: TwoPiApi,
    private walletEncryptionService: WalletEncryptionService,
    private walletService: WalletService
  ) {}
  activeInvestments: DefiInvestment[] = [];
  availableInvestments: DefiInvestment[] = [];
  haveInvestments = true;
  
  ionViewWillEnter(){
    this.emptyArrays();
  }

  async ionViewDidEnter() {
    this.getAvailableDefiProducts();
    await this.getInvestments();
  }

  emptyArrays(){
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
    const investments : DefiInvestment[] = [];
    const walletExist = await this.walletService.walletExist();
    for (const product of this.defiProducts) {
      const investmentProduct = await this.getInvestmentProduct(product);
      const balance = walletExist ? await this.getProductBalance(investmentProduct) : 0;
      investments.push(
        {
          product: investmentProduct,
          balance: balance,
          isComing: product.isComing,
          
        }
      )
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
    return TwoPiInvestment.create(investmentProduct, new VoidSigner(address));
  }

  filterUserInvestments(investments: DefiInvestment[]): void {
    this.activeInvestments = investments.filter((investment) => investment.balance > 0);
    this.availableInvestments = investments.filter((investment) => investment.balance === 0);
  }

  async getInvestmentProduct(product: DefiProduct): Promise<TwoPiProduct> {
    return new TwoPiProduct(await this.twoPiApi.vault(product.id), this.apiWalletService);
  }
}
