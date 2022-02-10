import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { InvestmentProduct } from '../shared-defi-investments/interfaces/investment-product.interface';
import { TwoPiApi } from '../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { TwoPiProduct } from '../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { TwoPiInvestment } from '../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { VoidSigner } from 'ethers';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';

@Component({
  selector: 'app-investment-detail',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'defi_investments.invest_detail.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.investmentProduct">
      <ion-card class="ux-card">
        <app-expandable-investment-info
          [investmentProduct]="this.investmentProduct"
        ></app-expandable-investment-info>
        <ion-item lines="none" class="invested-balance">
          <ion-label class="invested-balance__content">
            <ion-text class="invested-balance__content__label ux-font-titulo-xs">
              {{ 'defi_investments.invest_detail.invested_amount' | translate }}
            </ion-text>
            <div class="invested-balance__content__balance">
              <ion-text class="invested-balance__content__balance__text ux-font-text-base">
                {{ this.balance | number: '1.2-8' }} {{ this.token?.value }}
              </ion-text>
              <ion-text class="invested-balance__content__balance__text ux-font-text-base">
                {{ this.referenceBalance | number: '1.2-2'  }}{{ ' USD' }}
              </ion-text>
            </div>
          </ion-label>
        </ion-item>
      </ion-card>
      <ion-button
        appTrackClick
        name="add_amount"
        expand="block"
        size="large"
        class="ion-padding-start ion-padding-end ux_button"
        color="uxsecondary"
        (click)="this.addAmount()"
      >
        {{ 'defi_investments.invest_detail.button' | translate }}
      </ion-button>
      <ion-button
        appTrackClick
        name="finalize_invest"
        expand="block"
        fill="clear"
        size="small"
        class="link ux-link-xl ion-padding-start ion-padding-end"
        (click)="this.goToWithdraw()"
      >
        {{ 'defi_investments.invest_detail.button_link' | translate }}
      </ion-button>
    </ion-content>`,
  styleUrls: ['./investment-detail.page.scss'],
})
export class InvestmentDetailPage implements OnInit {
  investmentProduct: InvestmentProduct;
  token: Coin;
  referenceBalance: number;
  balance: number;
  constructor(
    private route: ActivatedRoute,
    private twoPiApi: TwoPiApi,
    private navController: NavController,
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private walletEncryptionService: WalletEncryptionService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.getInvestmentProduct();
  }

  private vaultID() {
    return this.route.snapshot.paramMap.get('vault');
  }

  async createInvestmentProduct(): Promise<InvestmentProduct> {
    return new TwoPiProduct(await this.twoPiApi.vault(this.vaultID()), this.apiWalletService);
  }

  async getInvestmentProduct() {
    this.investmentProduct = await this.createInvestmentProduct();
    this.getToken();
    await this.getProductBalance(this.investmentProduct);
  }

  getToken() {
    this.token = this.investmentProduct.token();
  }

  async getProductBalance(investmentProduct: InvestmentProduct): Promise<void> {
    const wallet = await this.walletEncryptionService.getEncryptedWallet();
    const address = wallet.addresses[investmentProduct.token().network];
    const investment = this.createInvestment(investmentProduct, address);
    this.balance = await investment.balance();
    this.getPrice();
  }

  createInvestment(investmentProduct: InvestmentProduct, address: string): TwoPiInvestment {
    return TwoPiInvestment.create(investmentProduct, new VoidSigner(address));
  }

  private getPrice() {
    this.apiWalletService
      .getPrices([this.token.value], false)
      .subscribe((res) => (this.referenceBalance = res.prices[this.token.value] * this.balance));
  }

  async addAmount() {
    const walletExist = await this.walletService.walletExist();
    if (walletExist) {
      this.navController.navigateForward(['/defi/new/insert-amount', this.investmentProduct.name(), 'add'], {replaceUrl : true});
    } else {
      this.navController.navigateForward(['/defi/no-wallet-to-invest'], {replaceUrl : true});
    }
  }

  goToWithdraw() {
    this.navController.navigateForward(['/defi/withdraw', this.investmentProduct.name()], {replaceUrl : true});
  }
}
