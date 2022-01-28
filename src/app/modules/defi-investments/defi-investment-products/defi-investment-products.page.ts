import { InvestmentProduct } from './../shared-defi-investments/interfaces/investment-product.interface';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { TwoPiInvestment } from './../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { Component, OnInit } from '@angular/core';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DefiInvestment } from '../shared-defi-investments/interfaces/defi-investment.interface';
import { DefiProduct } from '../shared-defi-investments/interfaces/defi-product.interface';
import { AvailableDefiProducts } from '../shared-defi-investments/models/available-defi-products/available-defi-products.model';
import { TwoPiApi } from '../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { TwoPiProduct } from '../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { VoidSigner } from 'ethers';

@Component({
  selector: 'app-defi-investment-products',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/investments"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'defi_investments.defi_investment_products.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div *ngIf="this.activeInvestments.length > 0" class="dp">
        <div class="dp__background"></div>
        <div class="dp__card ">
          <ion-item lines="none" slot="header">
            <ion-label>{{
              'defi_investments.defi_investment_products.title_investments' | translate
            }}</ion-label>
          </ion-item>
          <app-investment-balance-item
            *ngFor="let investment of this.activeInvestments"
            [investmentProduct]="investment.product"
            [balance]="investment.balance"
          ></app-investment-balance-item>
        </div>
      </div>
      <div class="dp">
        <div
          [ngClass]="{
            dp__background:
              this.availableInvestments.length > 0 && !this.activeInvestments.length,
            'dp__background-off':
              this.availableInvestments.length > 0 && this.activeInvestments.length
          }"
          class="dp__background"
        ></div>
        <div class="dp__card">
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
export class DefiInvestmentProductsPage implements OnInit {
  defiProducts: DefiProduct[];
  constructor(
    private apiWalletService: ApiWalletService,
    private twoPiApi: TwoPiApi,
    private walletEncryptionService: WalletEncryptionService
  ) {}
  haveInvestments = true;
  activeInvestments: DefiInvestment[] = [];
  availableInvestments: DefiInvestment[] = [];

  ngOnInit() {}

  ionViewWillEnter() {
    this.getAvailableDefiProducts();
    this.getInvestments();
  }

  getAvailableDefiProducts(): void {
    this.defiProducts = new AvailableDefiProducts().value();
  }

  async getInvestments(): Promise<void> {
    for (const product of this.defiProducts) {
      const investmentProduct = await this.getInvestmentProduct(product);
      const balance = await this.getProductBalance(investmentProduct);
      console.log(balance);
      this.filterUserInvestments({
        product: investmentProduct,
        balance: balance,
        isComing: product.isComing,
      });
    }
  }

  async getProductBalance(investmentProduct: InvestmentProduct) {
    const wallet = await this.walletEncryptionService.getEncryptedWallet();
    const address = wallet.addresses[investmentProduct.token().network];
    const investment = this.createInvestment(investmentProduct, address);
    return await investment.balance();
  }

  createInvestment(
    investmentProduct: InvestmentProduct,
    address: string
  ): TwoPiInvestment {
    console.log('No estare entrando aca?');
    return TwoPiInvestment.create(investmentProduct, new VoidSigner(address));
  }

  filterUserInvestments(investment: DefiInvestment) {
    investment.balance > 0
      ? this.activeInvestments.push(investment)
      : this.availableInvestments.push(investment);
  }

  async getInvestmentProduct(product: DefiProduct) {
    return new TwoPiProduct(await this.twoPiApi.vault(product.id), this.apiWalletService);
  }
}
