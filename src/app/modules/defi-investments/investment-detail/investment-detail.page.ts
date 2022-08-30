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
import { AvailableDefiProducts } from '../shared-defi-investments/models/available-defi-products/available-defi-products.model';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { GraphqlService } from '../../wallets/shared-wallets/services/graphql/graphql.service';

@Component({
  selector: 'app-investment-detail',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'defi_investments.invest_detail.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.investmentProduct" class="id">
      <ion-card class="id__card ux-card">
        <app-expandable-investment-info [investmentProduct]="this.investmentProduct"></app-expandable-investment-info>
        <ion-item lines="none" class="invested-balance">
          <ion-label class="invested-balance__content">
            <ion-text class="invested-balance__content__label ux-font-titulo-xs">
              {{ 'defi_investments.invest_detail.invested_amount' | translate }}
            </ion-text>
            <div class="invested-balance__content__balance">
              <ion-text class="invested-balance__content__balance__text ux-font-text-base">
                {{ this.balance | formattedAmount }} {{ this.token?.value }}
              </ion-text>
              <ion-text class="invested-balance__content__balance__text ux-font-text-base">
                {{ this.referenceBalance | formattedAmount: 10:2 }}{{ ' USD' }}
              </ion-text>
            </div>
          </ion-label>
        </ion-item>
      </ion-card>
      <div class="id__buttons">
        <div class="id__buttons__add-amount">
          <app-icon-button-card
            appTrackClick
            name="ux_invest_add_amount"
            [text]="'defi_investments.invest_detail.button' | translate"
            icon="ux-up-arrow"
            (click)="this.addAmount()"
          ></app-icon-button-card>
        </div>
        <div class="id__buttons__withdraw">
          <app-icon-button-card
            appTrackClick
            name="ux_invest_withdraw"
            [text]="'defi_investments.invest_detail.button_link' | translate"
            icon="ux-down-arrow"
            (click)="this.goToWithdraw()"
          ></app-icon-button-card>
        </div>
      </div>
      <div class="id__investment-history ion-padding">
        <div>
          <ion-text class="ux-font-header-titulo">
            {{ 'defi_investments.invest_detail.history.title' | translate }}</ion-text
          >
        </div>
        <div class="investment-history">
          <app-investment-history
            [firstMovements]="this.firstMovements"
            [remainingMovements]="this.remainingMovements"
            [token]="this.token"
          ></app-investment-history>
        </div>
      </div>
      <div class="id__weekly-profit-disclaimer ion-padding-horizontal" *ngIf="this.disclaimer">
        <ion-label class=" ux-font-text-xs" color="neutral80">
          {{ this.updateEarningText | translate }}
        </ion-label>
      </div>
    </ion-content>`,
  styleUrls: ['./investment-detail.page.scss'],
})
export class InvestmentDetailPage implements OnInit {
  investmentProduct: InvestmentProduct;
  token: Coin;
  referenceBalance: number;
  balance: number;
  disclaimer = false;
  updateEarningText: string;
  allMovements = [];
  address: string;
  firstMovements;
  remainingMovements;

  constructor(
    private route: ActivatedRoute,
    private twoPiApi: TwoPiApi,
    private navController: NavController,
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private walletEncryptionService: WalletEncryptionService,
    private remoteConfig: RemoteConfigService,
    private graphql: GraphqlService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.getInvestmentProduct();
    this.setDisclaimer();
    this.obtainPidOfProduct();
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
    this.address = wallet.addresses[investmentProduct.token().network];
    const investment = this.createInvestment(investmentProduct, this.address);
    this.balance = await investment.balance();
    this.getPrice();
  }

  createInvestment(investmentProduct: InvestmentProduct, address: string): TwoPiInvestment {
    return TwoPiInvestment.create(investmentProduct, new VoidSigner(address), this.apiWalletService);
  }

  private getPrice() {
    this.apiWalletService
      .getPrices([this.token.value], false)
      .subscribe((res) => (this.referenceBalance = res.prices[this.token.value] * this.balance));
  }

  async addAmount() {
    const walletExist = await this.walletService.walletExist();
    if (walletExist) {
      this.navController.navigateForward(['/defi/new/insert-amount', this.investmentProduct.name(), 'add']);
    } else {
      this.navController.navigateForward(['/defi/no-wallet-to-invest']);
    }
  }

  goToWithdraw() {
    this.navController.navigateForward(['/defi/withdraw/select-amount', this.investmentProduct.name()]);
  }

  obtainPidOfProduct() {
    this.createAvailableDefiProducts()
      .value()
      .find((product) => {
        if (product.id === this.investmentProduct.name()) {
          const pid = this.investmentProduct.id();
          this.getAllMovements(pid);
        }
      });
  }

  getAllMovements(pid: number) {
    this.graphql.getAllMovements(this.address, pid).subscribe(({ data }) => {
      this.allMovements = data.flows;
      this.separateFilteredData();
    });
  }

  separateFilteredData() {
    this.firstMovements = this.allMovements?.slice(0, 3);
    this.remainingMovements = this.allMovements?.slice(3, this.allMovements.length);
  }

  setDisclaimer() {
    const product = this.createAvailableDefiProducts()
      .value()
      .find((product) => product.id === this.investmentProduct.name());
    if (product) {
      this.disclaimer = true;
      this.updateEarningText = product.continuousEarning
        ? 'defi_investments.invest_detail.continuous_update'
        : 'defi_investments.invest_detail.weekly_update';
    }
  }

  createAvailableDefiProducts(): AvailableDefiProducts {
    return new AvailableDefiProducts(this.remoteConfig);
  }
}
