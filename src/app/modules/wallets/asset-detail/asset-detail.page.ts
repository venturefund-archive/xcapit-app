import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { WalletTransactionsService } from '../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { finalize } from 'rxjs/operators';
import { CovalentTransfer } from '../shared-wallets/models/covalent-transfer/covalent-transfer';
import { CovalentTransfersResponse } from '../shared-wallets/models/covalent-transfers-response/covalent-transfers-response';
import { NETWORK_COLORS } from '../shared-wallets/constants/network-colors.constant';
import { ProvidersFactory } from '../../fiat-ramps/shared-ramps/models/providers/factory/providers.factory';
import { ProviderTokensOf } from '../../fiat-ramps/shared-ramps/models/provider-tokens-of/provider-tokens-of';
import { TwoPiApi } from '../../defi-investments/shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { AvailableDefiProducts } from '../../defi-investments/shared-defi-investments/models/available-defi-products/available-defi-products.model';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { DefiProduct } from '../../defi-investments/shared-defi-investments/interfaces/defi-product.interface';
import { NavController } from '@ionic/angular';
import { TwoPiProduct } from '../../defi-investments/shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { InvestmentProduct } from '../../defi-investments/shared-defi-investments/interfaces/investment-product.interface';
import { TwoPiInvestment } from '../../defi-investments/shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { VoidSigner } from 'ethers';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { TwoPiInvestmentFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-investment/factory/two-pi-investment-factory';
import { TwoPiProductFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-product/factory/two-pi-product.factory';
import { Transfers } from '../shared-wallets/models/transfers/transfers';
import { DefaultCovalentRepo } from '../shared-wallets/models/covalent-repo/default/default-covalent-repo';
import { EnvService } from '../../../shared/services/env/env.service';
import { HttpClient } from '@angular/common/http';
import { RawToken } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { JSONTransfer } from '../shared-wallets/models/json-transfer/json-transfer';
import { Transfer } from '../shared-wallets/models/transfer/transfer.interface';
@Component({
  selector: 'app-asset-detail',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.asset_detail.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="wad ion-padding">
      <div class="ux_content">
        <ion-card class="wad__card">
          <div class="wad__title_and_image" *ngIf="this.currency">
            <div class="wad__title_and_image__image_container">
              <img [src]="this.currency.logoRoute" alt="Product Image" />
            </div>
            <div class="wad__title_container">
              <div class="wad__title_container__title">
                <ion-text class="ux-font-text-lg">{{ this.currency.value }}</ion-text>
                <ion-text class="ux-font-text-xs title">{{ this.currency.name | splitString: ' - '[1] }}</ion-text>
              </div>
              <div class="wad__title_container__badge">
                <ion-badge [color]="this.networkColors[this.currency.network]" class="ux-badge ux-font-num-subtitulo">{{
                  this.currency.network | formattedNetwork | uppercase
                }}</ion-badge>
              </div>
            </div>
            <ion-button
              *ngIf="this.productBalance >= 0"
              class="wad__invest-button"
              color="secondary"
              slot="end"
              [dataToTrack]="{ eventLabel: this.buttonName }"
              appTrackClick
              (click)="this.goToInvest()"
            >
              {{ 'wallets.asset_detail.invest_button' | translate }}
            </ion-button>
          </div>

          <div class="wad__available text-center">
            <ion-text class="title ux-font-titulo-xs">
              {{ 'wallets.asset_detail.available' | translate }}
            </ion-text>
            <div class="wad__available__amounts" *ngIf="this.balance">
              <ion-text class="ux-font-text-xl" color="neutral80">
                {{ this.balance.amount | formattedAmount }} {{ this.balance.symbol }}</ion-text
              >
              <ion-text class="ux-font-text-xxs" color="neutral80" *ngIf="this.balance?.usdAmount">
                ≈ {{ this.balance.usdAmount | formattedAmount: 10:2 }} USD
              </ion-text>
            </div>
          </div>
        </ion-card>

        <div class="wad__subheader_buttons" *ngIf="this.currency">
          <app-wallet-subheader-buttons
            [asset]="this.currency.value"
            [network]="this.currency.network"
            [enabledToBuy]="this.enabledToBuy"
          ></app-wallet-subheader-buttons>
        </div>

        <div class="wad__transaction" *ngIf="!!this.transfers.length">
          <div class="wad__transaction__title">
            <ion-label class="ux-font-text-lg ">
              {{ 'wallets.asset_detail.wallet_transaction_title' | translate }}
            </ion-label>
          </div>
          <div class="wad__transaction__wallet-transaction-card">
            <app-wallet-transaction-card
              [transfers]="this.transfers2"
              [network]="this.currency.network"
            ></app-wallet-transaction-card>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./asset-detail.page.scss'],
})
export class AssetDetailPage implements OnInit {
  buttonName: string;
  currency: Coin;
  coins: Coin[];
  walletAddress: string = null;
  balance: AssetBalance;
  transfers2: CovalentTransfer[] = [];
  transfers: Transfer[] = [];
  usdPrice: { prices: any };
  networkColors = NETWORK_COLORS;
  enabledToBuy: boolean;
  defiProducts: DefiProduct[];
  allDefiProducts: InvestmentProduct[] = [];
  productToInvest: InvestmentProduct;
  productBalance: number;

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService,
    private storageService: StorageService,
    private walletTransactionsService: WalletTransactionsService,
    private apiWalletService: ApiWalletService,
    private providers: ProvidersFactory,
    private twoPiApi: TwoPiApi,
    private remoteConfig: RemoteConfigService,
    private navController: NavController,
    private walletEncryptionService: WalletEncryptionService,
    private twoPiInvestmentFactory: TwoPiInvestmentFactory,
    private twoPiProductFactory: TwoPiProductFactory,
    private http: HttpClient,
    private env: EnvService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.walletService.walletExist();
    this.coins = this.apiWalletService.getCoins();
    this.getCurrency();
    this.getButtonName();
    this.getBalanceStructure(this.currency);
    this.getTransfers2();
    this.getUsdPrice();
    this.getAvailableDefiProducts();
    await this.getInvestments();
    await this.findProductToInvest();
    
  }

  private getAvailableDefiProducts(): void {
    this.defiProducts = this.createAvailableDefiProducts().value();
  }

  createAvailableDefiProducts(): AvailableDefiProducts {
    return new AvailableDefiProducts(this.remoteConfig);
  }

  async getInvestments() {
    const investmentsProducts = [];
    for (const product of this.defiProducts) {
      const anInvestmentProduct = await this.getInvestmentProduct(product);
      investmentsProducts.push(anInvestmentProduct);
    }
    this.allDefiProducts = investmentsProducts;
  }

  async getInvestmentProduct(product: DefiProduct): Promise<TwoPiProduct> {
    return this.twoPiProductFactory.create(await this.twoPiApi.vault(product.id));
  }

  async setBalance(product) {
    if (product) {
      this.productBalance = await this.getProductBalance(product);
    }
  }

  async getProductBalance(investmentProduct: InvestmentProduct): Promise<number> {
    const wallet = await this.walletEncryptionService.getEncryptedWallet();
    const address = wallet.addresses[investmentProduct.token().network];
    const investment = this.createInvestment(investmentProduct, address);
    return await investment.balance();
  }

  createInvestment(investmentProduct: InvestmentProduct, address: string): TwoPiInvestment {
    return this.twoPiInvestmentFactory.new(investmentProduct, new VoidSigner(address), this.apiWalletService);
  }

  async findProductToInvest() {
    this.allDefiProducts.find((product) => {
      if (product.token().value === this.currency.value) {
        this.productToInvest = product;
      }
    });
    await this.setBalance(this.productToInvest);
  }

  goToInvest() {
    if (this.productBalance > 0) {
      this.navController.navigateForward(['/defi/investment-detail/', this.productToInvest.name()]);
    } else {
      this.navController.navigateForward(['/defi/new/insert-amount', this.productToInvest.name(), 'invest']);
    }
  }

  private getBalanceStructure(coin) {
    this.balance = {
      icon: coin.logoRoute,
      symbol: coin.value,
      name: coin.name,
      amount: 0,
      usdAmount: 0,
      usdSymbol: 'USD',
    };
  }

  private getUsdPrice() {
    this.apiWalletService
      .getPrices([this.getCoinForPrice(this.currency.value)])
      .pipe(finalize(() => this.getAssetBalance()))
      .subscribe((res) => (this.usdPrice = res));
  }

  private getAssetBalance() {
    this.storageService.getWalletsAddresses(this.currency.network).then((address) => {
      this.walletService.balanceOf(address, this.currency.value).then((balance) => {
        this.balance.amount = parseFloat(balance);
        if (this.usdPrice) {
          this.balance.usdAmount = this.balance.amount * this.getUsdAmount(this.currency.value);
        }
      });
    });
  }

  private getCurrency() {
    this.currency = this.coins.find((c) => c.value === this.route.snapshot.paramMap.get('currency'));
    this.enabledToBuy = !!new ProviderTokensOf(this.getProviders(), [this.currency]).all().length;
  }

  getButtonName() {
    this.buttonName = `ux_go_to_invest_${this.currency.value.toLowerCase()}`;
  }

   private getTransfers() {
    this.storageService
      .getWalletsAddresses()
      .then((addresses: any) =>
        this.walletTransactionsService
          .getTransfers(addresses[this.currency.network], this.currency)
          .subscribe((res: CovalentTransfersResponse) => (this.transfers = res.value()))
      );
  } 

   async getTransfers2() {
    const wallet = await this.walletEncryptionService.getEncryptedWallet();
    const address = wallet.addresses[this.currency.network];
    this.transfers = await new Transfers(
      this.currency as RawToken,
      address,
      new DefaultCovalentRepo(this.http, this.env)
    )
      .all()
    
  } 

  private getCoinForPrice(symbol: string): string {
    return symbol === 'RBTC' ? 'BTC' : symbol;
  }

  private getUsdAmount(symbol: string): number {
    return this.usdPrice.prices[this.getCoinForPrice(symbol)];
  }

  private getProviders() {
    return this.providers.create();
  }
}
