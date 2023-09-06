import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup, IonContent, NavController } from '@ionic/angular';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { BalanceCacheService } from '../shared-wallets/services/balance-cache/balance-cache.service';
import { HttpClient } from '@angular/common/http';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';
import { TotalBalance } from '../shared-wallets/models/balance/total-balance/total-balance';
import { ZeroBalance } from '../shared-wallets/models/balance/zero-balance/zero-balance';
import { NullPrices } from '../shared-wallets/models/prices/null-prices/null-prices';
import { NullBalances } from '../shared-wallets/models/balances/null-balances/null-balances';
import { CovalentBalancesInjectable } from '../shared-wallets/models/balances/covalent-balances/covalent-balances.injectable';
import { TokenPricesInjectable } from '../shared-wallets/models/prices/token-prices/token-prices.injectable';
import { TotalBalanceInjectable } from '../shared-wallets/models/balance/total-balance/total-balance.injectable';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { AvailableDefiProducts } from '../../defi-investments/shared-defi-investments/models/available-defi-products/available-defi-products.model';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { DefiProduct } from '../../defi-investments/shared-defi-investments/interfaces/defi-product.interface';
import { TwoPiProduct } from '../../defi-investments/shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { TwoPiProductFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-product/factory/two-pi-product.factory';
import { TwoPiApi } from '../../defi-investments/shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { DefaultTokens } from '../../swaps/shared-swaps/models/tokens/tokens';
import { TokenRepo } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { BlockchainTokens } from '../../swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { NewTokensAvailable } from '../shared-wallets/models/new-tokens-avalaible/new-tokens-available.model';
import { NewToken } from '../shared-wallets/interfaces/new-token.interface';
import { UpdateNewsService } from '../../../shared/services/update-news/update-news.service';
import { TotalInvestedBalanceOfInjectable } from '../../defi-investments/shared-defi-investments/models/total-invested-balance-of/injectable/total-invested-balance-of.injectable';
import { Base64ImageFactory } from '../shared-wallets/models/base-64-image-of/factory/base-64-image-factory';
import { ContactDataService } from '../../contacts/shared-contacts/services/contact-data/contact-data.service';
import { WCService } from '../shared-wallets/services/wallet-connect/wc-service/wc.service';
import { TokenDetailInjectable } from '../shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { WalletsFactory } from '../shared-wallets/models/wallets/factory/wallets.factory';

@Component({
  selector: 'app-home-wallet',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <div class="header">
          <app-xcapit-logo [whiteLogo]="true"></app-xcapit-logo>
        </div>
        <div (click)="this.goToWalletConnect()" appTrackClick [dataToTrack]="{ eventLabel: 'ux_go_to_wc' }">
          <ion-icon *ngIf="!this.connected" name="ux-walletconnect"></ion-icon>
          <ion-icon *ngIf="this.connected" name="ux-walletconnectconnect"></ion-icon>
        </div>
        <app-avatar-profile></app-avatar-profile>
      </ion-toolbar>
    </ion-header>

    <ion-content>
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
      <div class="wt__subheader__value">
        <div class="title ux-font-num-subtitulo">
          <ion-text>
            {{ 'wallets.home.available_money' | translate }}
          </ion-text>
        </div>
        <div class="wt__spinner-and-amount ux-font-num-titulo">
          <ion-spinner color="white" name="crescent" *ngIf="this.balance === undefined"></ion-spinner>
          <div class="wt__amount-and-eye">
            <div class="wt__amount-and-eye__amount">
              <ion-text *ngIf="this.balance !== undefined">
                {{ this.balance ?? 0.0 | number : '1.2-2' | hideText : this.hideFundText }}
              </ion-text>
              <ion-text class="ux-font-text-lg" *ngIf="this.balance !== undefined">USD</ion-text>
            </div>
            <div *ngIf="this.balance !== undefined" class="wt__amount-and-eye__eye">
              <app-eye></app-eye>
            </div>
          </div>
        </div>
        <div class="wt__total-invested" *ngIf="this.balance" color="success">
          <ion-spinner
            class="wt__total-invested__spinner"
            *ngIf="this.totalInvested === undefined"
            color="white"
            name="crescent"
          ></ion-spinner>
          <ion-text *ngIf="this.totalInvested !== undefined" class="wt__total-invested__text ux-font-title-xs"
            >{{ 'wallets.home.invested' | translate }}
            {{ this.totalInvested ?? 0.0 | number : '1.2-2' | hideText : this.hideFundText }} USD</ion-text
          >
        </div>
      </div>
      <div class="wt__overlap_buttons">
        <app-wallet-subheader-buttons></app-wallet-subheader-buttons>
      </div>
      <div>
        <app-home-slides *ngIf="this.slides.length > 0" [slides]="this.slides"></app-home-slides>
      </div>

      <div class="wt__backup" *ngIf="!this.protectedWallet">
        <app-backup-information-card
          [text]="'wallets.home.backup_card_component.text'"
          [textClass]="'ux-home-backup-card'"
          (cardClicked)="this.goToBackup()"
        >
        </app-backup-information-card>
      </div>
      <div class="wt__transaction-in-progress">
        <app-transaction-in-progress></app-transaction-in-progress>
      </div>
      <div class="wt">
        <div class="wt__segments">
          <form [formGroup]="this.segmentsForm">
            <ion-segment mode="ios" class="ux-segment-modern" formControlName="tab">
              <ion-segment-button value="assets" name="ux_tab_tokens" appTrackClick>
                <ion-label
                  [ngClass]="{ 'active-tab': this.segmentsForm.value.tab === 'assets' }"
                  class="ux-font-text-lg"
                  >{{ 'wallets.home.tab_assets' | translate }}</ion-label
                >
              </ion-segment-button>
              <ion-segment-button value="nft" name="ux_tab_nfts" appTrackClick>
                <ion-label
                  [ngClass]="{ 'active-tab': this.segmentsForm.value.tab === 'nft' }"
                  class="ux-font-text-lg"
                  >{{ 'wallets.home.tab_nfts' | translate }}</ion-label
                >
              </ion-segment-button>
            </ion-segment>
          </form>
        </div>
        <div class="wt__nfts" *ngIf="this.segmentsForm.value.tab === 'nft'">
          <div class="wt__nfts__content segment-content last-selected">
            <app-nft-card></app-nft-card>
          </div>
        </div>
        <div class="wt__balance" *ngIf="this.segmentsForm.value.tab === 'assets'">
          <div class="wt__balance segment-content first-selected">
            <div class="wt__balance__button ion-padding-end">
              <ion-button
                appTrackClick
                name="Edit Tokens"
                class="ion-no-margin"
                fill="clear"
                (click)="this.goToSelectCoins()"
              >
                <ion-icon icon="ux-adjustments"></ion-icon>
              </ion-button>
            </div>
            <ion-spinner
              class="wt__balance__loading"
              color="primary"
              name="crescent"
              *ngIf="this.tokenDetails.length === 0 && this.allLoaded === false"
            ></ion-spinner>
            <div *appFeatureFlag="'ff_newTokenAvailable'">
              <app-new-token-available-card *ngFor="let newToken of this.newTokens" [newToken]="newToken">
              </app-new-token-available-card>
            </div>
            <div class="wt__balance__no-token" *ngIf="this.tokenDetails.length === 0 && this.allLoaded === true">
              <ion-text class="ux-font-text-xxs wt__balance__no-token__title">{{
                'wallets.home.no_tokens_selected.title' | translate
              }}</ion-text>
              <img src="assets/img/wallets/growing_rafiki.svg" />
              <ion-text class="ux-link-xs wt__balance__no-token__link" (click)="this.goToSelectCoins()">{{
                'wallets.home.no_tokens_selected.link' | translate
              }}</ion-text>
            </div>
            <div *ngIf="this.tokenDetails.length > 0">
              <app-accordion-tokens [tokenDetails]="tokenDetails"> </app-accordion-tokens>
            </div>
          </div>
        </div>
      </div>
      <div class="quotes-card" *appFeatureFlag="'ff_newLogin'">
        <app-quotes-card></app-quotes-card>
      </div>
    </ion-content>`,
  styleUrls: ['./home-wallet.page.scss'],
})
export class HomeWalletPage implements OnInit {
  hideFundText: boolean;
  protectedWallet: boolean;
  tokenDetails: TokenDetail[] = [];
  userTokens: Coin[];
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  segmentsForm: UntypedFormGroup = this.formBuilder.group({
    tab: ['assets', [Validators.required]],
  });
  totalBalanceModel: TotalBalance;
  balance = undefined;
  address: string;
  defiProducts: DefiProduct[];
  totalInvested: number;
  slides = [];
  twoPiProducts: TwoPiProduct[] = [];
  newTokens: NewToken[];
  connected: boolean;
  allLoaded = false;

  constructor(
    private navController: NavController,
    private formBuilder: UntypedFormBuilder,
    private refreshTimeoutService: RefreshTimeoutService,
    private storageService: StorageService,
    private balanceCacheService: BalanceCacheService,
    private http: HttpClient,
    private covalentBalances: CovalentBalancesInjectable,
    private tokenPrices: TokenPricesInjectable,
    private tokenDetail: TokenDetailInjectable,
    private totalBalance: TotalBalanceInjectable,
    private trackService: TrackService,
    private ionicStorageService: IonicStorageService,
    private localStorageService: LocalStorageService,
    private remoteConfig: RemoteConfigService,
    private twoPiProductFactory: TwoPiProductFactory,
    private twoPiApi: TwoPiApi,
    private blockchainsFactory: BlockchainsFactory,
    private walletsFactory: WalletsFactory,
    private updateNewsService: UpdateNewsService,
    private totalInvestedBalanceOfInjectable: TotalInvestedBalanceOfInjectable,
    private base64ImageFactory: Base64ImageFactory,
    private contactService: ContactDataService,
    private wcService: WCService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getSliderImages();
    this.subscribeOnHideFunds();
    this.trackScreenView();
    this.getUserWalletAddress();
    this.isProtectedWallet();
    this.getNewTokensAvailable();
    this.checkConnectionOfWalletConnect();
    this.cleanContact();
    this.notificationsService.getInstance().register();
  }


  async getSliderImages() {
    const slides = await this.remoteConfig.getObject('appSlides');
    for (const slide of slides) {
      slide.image = await (await this.base64ImageFactory.new(slide.image)).value();
    }
    this.slides = slides;
  }

  private trackScreenView() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_screenview_wallet',
    });
  }

  async ionViewDidEnter() {
    this.showUpdateModal();
    await this.initialize();
  }

  async initialize(): Promise<void> {
    await this.content.scrollToTop(0);
    await this.loadCachedTotalBalance();
    await this.setUserTokens();
    this.initializeTotalBalance();
    await this.setTokenDetails();
    this.fetchAndSaveBalances();
    this.setAvailableDefiProducts();
    await this.setInvestments();
    this.setInvestedBalance();
  }

  private cleanContact() {
    this.contactService.updateContact(null);
  }

  private showUpdateModal() {
    this.updateNewsService.showModal();
  }

  checkConnectionOfWalletConnect() {
    this.connected = this.wcService.connected();
  }

  private setAvailableDefiProducts(): void {
    this.defiProducts = this.createAvailableDefiProducts().value();
  }

  createAvailableDefiProducts(): AvailableDefiProducts {
    return new AvailableDefiProducts(this.remoteConfig);
  }

  async setInvestments() {
    this.twoPiProducts = [];
    for (const product of this.defiProducts) {
      const anInvestmentProduct = await this.getInvestmentProduct(product);
      this.twoPiProducts.push(anInvestmentProduct);
    }
  }

  async getInvestmentProduct(product: DefiProduct): Promise<TwoPiProduct> {
    return this.twoPiProductFactory.create(await this.twoPiApi.vault(product.id));
  }

  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    if (wallet) this.address = wallet.addresses.MATIC;
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  private async fetchAndSaveBalances() {
    await this.fetchDetails();
    await this.fetchTotalBalance();
    await this.updateCachedTotalBalance();
  }

  goToBackup() {
    this.navController.navigateForward('/wallets/recovery/read');
  }

  goToWalletConnect() {
    const url = this.connected ? '/wallets/wallet-connect/connection-detail' : '/wallets/wallet-connect/new-connection';
    this.navController.navigateForward(url);
  }

  private initializeTotalBalance() {
    this.totalBalanceModel = this.totalBalance.create(new NullPrices(), new NullBalances(), new ZeroBalance());
  }

  private async setTokenDetails() {
    const tokenDetails = [];

    for (const blockchain of this.blockchainsFactory.create().value()) {
      const tokens: any = new BlockchainTokens(blockchain, new DefaultTokens(new TokenRepo(this.userTokens)));
      if ((await tokens.value()).length) {
        const balances = this.covalentBalances.create(
          (await this.walletsFactory.create().oneBy(blockchain)).address(),
          tokens,
          this.http
        );
        const prices = this.tokenPrices.create(tokens, this.http);
        for (const token of await tokens.value()) {
          const tokenDetail = this.tokenDetail.create(balances, prices, token);
          tokenDetails.push(tokenDetail);
          await tokenDetail.cached();
        }
        this.totalBalanceModel = this.totalBalance.create(prices, balances, this.totalBalanceModel);
      }
    }
    this.sortTokens(tokenDetails);
    this.tokenDetails = tokenDetails;
    this.allLoaded = true;
  }

  private async fetchDetails() {
    for (const tokenDetail of this.tokenDetails) {
      await tokenDetail.fetch();
      await tokenDetail.cache();
    }
    this.sortTokens(this.tokenDetails);
  }

  private async fetchTotalBalance() {
    this.balance = await this.totalBalanceModel.value();
  }

  private sortTokens(tokenDetails: TokenDetail[]) {
    tokenDetails.sort((a, b) => b.balance * b.price - a.balance * a.price);
  }

  async refresh(event: any): Promise<void> {
    if (this.refreshTimeoutService.isAvailable()) {
      await this.initialize();
      this.refreshTimeoutService.lock();
    }
    setTimeout(() => event.target.complete(), 1000);
  }

  private async loadCachedTotalBalance() {
    this.balance = await this.balanceCacheService.total();
  }

  async setInvestedBalance() {
    const totalInvestedBalanceOf = this.totalInvestedBalanceOfInjectable.create(this.address, this.twoPiProducts);
    this.totalInvested = await totalInvestedBalanceOf.cached();
    this.totalInvested = await totalInvestedBalanceOf.value();
  }

  private async updateCachedTotalBalance() {
    await this.balanceCacheService.updateTotal(this.balance);
  }

  private async setUserTokens(): Promise<void> {
    this.userTokens = await this.storageService.getAssetsSelected();
  }

  async isProtectedWallet() {
    this.protectedWallet = await this.ionicStorageService.get('protectedWallet');
  }

  goToSelectCoins(): void {
    this.navController.navigateForward(['/wallets/select-coins', 'edit']);
  }

  private getNewTokensAvailable(): void {
    this.newTokens = new NewTokensAvailable(this.remoteConfig).value();
  }
}
