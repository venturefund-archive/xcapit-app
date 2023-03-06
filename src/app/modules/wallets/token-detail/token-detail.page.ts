import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
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
import { VoidSigner } from 'ethers';
import { TwoPiInvestmentFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-investment/factory/two-pi-investment-factory';
import { TwoPiProductFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-product/factory/two-pi-product.factory';
import { RawToken, TokenRepo } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { Transfer } from '../shared-wallets/models/transfer/transfer.interface';
import { TransfersFactory } from '../shared-wallets/models/transfers/factory/transfers.factory';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { FixedTokens } from '../../swaps/shared-swaps/models/filtered-tokens/fixed-tokens';
import { BlockchainTokens } from '../../swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { DefaultTokens } from '../../swaps/shared-swaps/models/tokens/tokens';
import { WalletsFactory } from '../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { CovalentBalancesInjectable } from '../shared-wallets/models/balances/covalent-balances/covalent-balances.injectable';
import { TokenPricesInjectable } from '../shared-wallets/models/prices/token-prices/token-prices.injectable';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';
import { Wallet } from '../../swaps/shared-swaps/models/wallet/wallet';
import { Blockchain } from '../../swaps/shared-swaps/models/blockchain/blockchain';
import { RawBlockchain } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { TokenByAddress } from '../../swaps/shared-swaps/models/token-by-address/token-by-address';
import { Token } from '../../swaps/shared-swaps/models/token/token';
import { TokenDetailInjectable } from '../shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { FiatRampsService } from '../../fiat-ramps/shared-ramps/services/fiat-ramps.service';

@Component({
  selector: 'app-token-detail',
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
      <ion-refresher
        (ionRefresh)="this.refresh($event)"
        close-duration="1000ms"
        slot="fixed"
        pull-factor="0.6"
        pull-min="50"
        pull-max="60"
      >
        <ion-refresher-content class="refresher" refreshingSpinner="true" pullingIcon="false">
          <app-ux-loading-block *ngIf="this.isRefreshAvailable$ | async" minSize="34px"></app-ux-loading-block>
          <ion-text class="ux-font-text-xxs" color="neutral80" *ngIf="(this.isRefreshAvailable$ | async) === false">
            {{
              'app.main_menu.pull_to_refresh'
                | translate
                  : {
                      seconds: (this.refreshRemainingTime$ | async)
                    }
            }}
          </ion-text>
        </ion-refresher-content>
      </ion-refresher>
      <div class="ux_content">
        <ion-card class="wad__card">
          <div class="wad__title_and_image" *ngIf="this.tplToken">
            <div class="wad__title_and_image__image_container">
              <img [src]="this.tplToken.logoRoute" alt="Product Image" />
            </div>
            <div class="wad__title_container">
              <div class="wad__title_container__title">
                <ion-text class="ux-font-text-lg">{{ this.tplToken.value }}</ion-text>
                <ion-text class="ux-font-text-xs title">{{ this.tplToken.name | splitString: ' - '[1] }}</ion-text>
              </div>
              <div class="wad__title_container__badge">
                <app-token-network-badge [blockchainName]="this.tplBlockchain.name"></app-token-network-badge>
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
            <div class="wad__available__amounts" *ngIf="this.tokenDetail">
              <ion-text class="ux-font-text-xl" color="neutral80">
                {{ this.tokenDetail.balance | formattedAmount }} {{ this.tplToken.value }}</ion-text
              >
              <ion-text class="ux-font-text-xxs" color="neutral80" *ngIf="this.tokenDetail?.price">
                ≈ {{ this.tokenDetail.price * this.tokenDetail.balance | formattedAmount: 10:2 }}
                {{ this.tokenDetail.quoteSymbol }}
              </ion-text>
            </div>
          </div>
        </ion-card>
        <div class="wad__subheader_buttons" *ngIf="this.tplToken">
          <app-wallet-subheader-buttons
            [asset]="this.tplToken.value"
            [network]="this.tplBlockchain.name"
            [tokenAddress]="this.tplToken.contract"
            [enabledToBuy]="this.enabledToBuy"
            [enabledToOperate]="this.enabledToOperate"
          ></app-wallet-subheader-buttons>
        </div>

        <div
          class="wad__transaction"
          *ngIf="(this.transfers !== undefined && this.transfers.length > 0) || this.transfers === undefined"
        >
          <div class="wad__transaction__title">
            <ion-label class="ux-font-header-titulo">
              {{ 'wallets.asset_detail.wallet_transaction_title' | translate }}
            </ion-label>
          </div>
          <div class="wad__transaction__wallet-transaction-card">
            <app-wallet-transaction-card
              *ngIf="this.transfers !== undefined"
              [transfers]="this.transfers"
              [network]="this.tplBlockchain.name"
            ></app-wallet-transaction-card>
            <app-wallet-transaction-skeleton-card
              *ngIf="this.transfers === undefined"
            ></app-wallet-transaction-skeleton-card>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./token-detail.page.scss'],
})
export class TokenDetailPage {
  buttonName: string;
  transfers: Transfer[];
  networkColors = NETWORK_COLORS;
  enabledToBuy: boolean;
  enabledToOperate: boolean;
  defiProducts: DefiProduct[];
  allDefiProducts: InvestmentProduct[] = [];
  productToInvest: InvestmentProduct;
  productBalance: number;
  tokenDetail: TokenDetail;
  tplToken: RawToken;
  tplBlockchain: RawBlockchain;
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;
  private token: Token;
  private wallet: Wallet;
  private blockchain: Blockchain;

  constructor(
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService,
    private providers: ProvidersFactory,
    private twoPiApi: TwoPiApi,
    private remoteConfig: RemoteConfigService,
    private navController: NavController,
    private twoPiInvestmentFactory: TwoPiInvestmentFactory,
    private twoPiProductFactory: TwoPiProductFactory,
    private transfersFactory: TransfersFactory,
    private blockchainsFactory: BlockchainsFactory,
    private walletsFactory: WalletsFactory,
    private covalentBalancesInjectable: CovalentBalancesInjectable,
    private tokenPricesInjectable: TokenPricesInjectable,
    private tokenDetailInjectable: TokenDetailInjectable,
    private refreshTimeoutService: RefreshTimeoutService,
    private fiatRampsService: FiatRampsService
  ) {}

  async ionViewWillEnter() {
    this.setBlockchain();
    await this.setToken();
    await this.setWallet();
    await this.setTokenDetail();
    this.setButtonName();
    await this.setAllowedOperations();
    await this.getTransfers();
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
      investmentsProducts.push(await this.getInvestmentProduct(product));
    }
    this.allDefiProducts = investmentsProducts;
  }

  async getInvestmentProduct(product: DefiProduct): Promise<TwoPiProduct> {
    return this.twoPiProductFactory.create(await this.twoPiApi.vault(product.id));
  }

  async setBalance(anInvestmentProduct: InvestmentProduct) {
    if (anInvestmentProduct) {
      this.productBalance = await this.twoPiInvestmentFactory
        .new(anInvestmentProduct, new VoidSigner(this.wallet.address()), this.apiWalletService)
        .balance();
    }
  }

  async findProductToInvest() {
    this.allDefiProducts.find((product) => {
      if (product.token().value === this.token.symbol() && product.token().network === this.token.network()) {
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

  private async setWallet() {
    this.wallet = await this.walletsFactory.create().oneBy(this.blockchain);
  }

  private setBlockchain() {
    this.blockchain = this.blockchainsFactory.create().oneByName(this.route.snapshot.paramMap.get('blockchain'));
    this.tplBlockchain = this.blockchain.json();
  }

  private async setToken() {
    this.token = await new TokenByAddress(
      this.route.snapshot.paramMap.get('token'),
      new BlockchainTokens(this.blockchain, new DefaultTokens(new TokenRepo(this.apiWalletService.getCoins())))
    ).value();
    this.tplToken = this.token.json();
  }

  private async setTokenDetail() {
    const fixedTokens = new FixedTokens([this.token]);
    this.tokenDetail = this.tokenDetailInjectable.create(
      this.covalentBalancesInjectable.create(this.wallet.address(), fixedTokens),
      this.tokenPricesInjectable.create(fixedTokens),
      (await fixedTokens.value())[0]
    );
    this.tokenDetail.cached();
    this.tokenDetail.fetch();
  }

  setButtonName() {
    this.buttonName = `ux_go_to_invest_${this.token.symbol().toLowerCase()}`;
  }

  async getTransfers() {
    if (this.blockchain.name() !== 'SOLANA') {
      this.transfers = undefined;
      const transfers = this.transfersFactory.create(this.token.json(), this.wallet.address());
      this.transfers = await transfers.cached();
      this.transfers = await transfers.all();
    }
  }

  private async setAllowedOperations() {
    const providerTokens = await new ProviderTokensOf(this.providers.create(), [this.token.json()], this.fiatRampsService).all()
    this.enabledToBuy = !!(providerTokens).length;
    this.enabledToOperate = true;
  }

  async refresh(event: any): Promise<void> {
    if (this.refreshTimeoutService.isAvailable()) {
      await this.getTransfers();
      this.refreshTimeoutService.lock();
    }
    setTimeout(() => event.target.complete(), 1000);
  }
}
