import { BalanceCacheService } from '../shared-wallets/services/balance-cache/balance-cache.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonContent, IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeWalletPage } from './home-wallet.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { WalletBalanceService } from '../shared-wallets/services/wallet-balance/wallet-balance.service';
import { RefreshTimeoutService } from 'src/app/shared/services/refresh-timeout/refresh-timeout.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { By } from '@angular/platform-browser';
import { TotalBalanceInjectable } from '../shared-wallets/models/balance/total-balance/total-balance.injectable';
import { FakeBalance } from '../shared-wallets/models/balance/fake-balance/fake-balance';
import { TokenPricesInjectable } from '../shared-wallets/models/prices/token-prices/token-prices.injectable';
import { FakePrices } from '../shared-wallets/models/prices/fake-prices/fake-prices';
import { CovalentBalancesInjectable } from '../shared-wallets/models/balances/covalent-balances/covalent-balances.injectable';
import { FakeBalances } from '../shared-wallets/models/balances/fake-balances/fake-balances';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { HideTextPipe } from 'src/app/shared/pipes/hide-text/hide-text.pipe';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { TwoPiProductFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-product/factory/two-pi-product.factory';
import { TwoPiApi } from '../../defi-investments/shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { Vault } from '@2pi-network/sdk';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeWallet } from '../shared-wallets/models/wallet/fake/fake-wallet';
import { rawETHData, rawMATICData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';
import { UpdateNewsService } from '../../../shared/services/update-news/update-news.service';
import { TotalInvestedBalanceOfInjectable } from '../../defi-investments/shared-defi-investments/models/total-invested-balance-of/injectable/total-invested-balance-of.injectable';
import { FakeTotalInvestedBalanceOf } from '../../defi-investments/shared-defi-investments/models/total-invested-balance-of/fake/fake-total-invested-balance-of';
import { Base64ImageFactory } from '../shared-wallets/models/base-64-image-of/factory/base-64-image-factory';
import { ContactDataService } from '../../contacts/shared-contacts/services/contact-data/contact-data.service';
import { WCService } from '../shared-wallets/services/wallet-connect/wc-service/wc.service';
import { TokenDetailInjectable } from '../shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NullNotificationsService } from '../../notifications/shared-notifications/services/null-notifications/null-notifications.service';
import { WalletsFactory } from '../shared-wallets/models/wallets/factory/wallets.factory';

describe('HomeWalletPage', () => {
  let component: HomeWalletPage;
  let fixture: ComponentFixture<HomeWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomeWalletPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let refreshTimeoutServiceSpy: jasmine.SpyObj<RefreshTimeoutService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let balanceCacheServiceSpy: jasmine.SpyObj<BalanceCacheService>;
  let contentSpy: jasmine.SpyObj<IonContent>;
  let coinSpy: jasmine.SpyObj<Coin>;
  let totalBalanceInjectableSpy: jasmine.SpyObj<TotalBalanceInjectable>;
  let tokenPricesInjectableSpy: jasmine.SpyObj<TokenPricesInjectable>;
  let covalentBalancesInjectableSpy: jasmine.SpyObj<CovalentBalancesInjectable>;
  let tokenDetailInjectableSpy: jasmine.SpyObj<TokenDetailInjectable>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let twoPiProductFactorySpy: jasmine.SpyObj<TwoPiProductFactory>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let base64ImageFactorySpy: jasmine.SpyObj<Base64ImageFactory>;
  let walletsFactorySpy: jasmine.SpyObj<WalletsFactory>;
  let walletConnectServiceSpy: jasmine.SpyObj<WCService>;
  let updateNewsServiceSpy: jasmine.SpyObj<UpdateNewsService>;
  let totalInvestedBalanceOfInjectableSpy: jasmine.SpyObj<TotalInvestedBalanceOfInjectable>;
  let contactDataServiceSpy: jasmine.SpyObj<ContactDataService>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;

  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    updateNewsServiceSpy = jasmine.createSpyObj('UpdateNewsService', { showModal: Promise.resolve() });
    navControllerSpy = fakeNavController.createSpy();
    totalBalanceInjectableSpy = jasmine.createSpyObj('TotalBalanceInjectable', { create: new FakeBalance(10) });
    tokenPricesInjectableSpy = jasmine.createSpyObj('TokenPricesInjectable', { create: new FakePrices() });
    covalentBalancesInjectableSpy = jasmine.createSpyObj('CovalentBalancesInjectable', { create: new FakeBalances() });
    localStorageServiceSpy = jasmine.createSpyObj(
      'LocalStorageService',
      {
        toggleHideFunds: undefined,
      },
      { hideFunds: of(false) }
    );
    contactDataServiceSpy = jasmine.createSpyObj('ContactDataService', {
      updateContact: {},
    });
    tokenDetailSpy = jasmine.createSpyObj(
      'TokenDetail',
      { cached: Promise.resolve({ balance: 10, price: 2 }), fetch: Promise.resolve(), cache: Promise.resolve() },
      {
        price: 20,
        balance: 1,
        quoteSymbol: 'USD',
        coin: coinSpy,
      }
    );
    tokenDetailInjectableSpy = jasmine.createSpyObj('TokenDetailSpy', { create: tokenDetailSpy });
    coinSpy = jasmine.createSpyObj('Coin', {}, { logoRoute: '', value: 'ETH', name: 'Ethereum', network: 'ERC20' });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      createNFTRequest: of({}),
      getNetworks: ['ERC20'],
    });

    walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', {
      getUsdTotalBalance: Promise.resolve(5120),
      balanceOf: Promise.resolve(20),
      priceOf: Promise.resolve(10),
    });

    refreshTimeoutServiceSpy = jasmine.createSpyObj('RefreshTimeoutService', {
      isAvailable: true,
      lock: of(),
    });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getAssetsSelected: Promise.resolve([rawETHData, rawMATICData]),
      getWalletsAddresses: Promise.resolve('0x00001'),
      getWalletFromStorage: Promise.resolve({
        addresses: { MATIC: 'testAddressMatic' },
      }),
    });

    balanceCacheServiceSpy = jasmine.createSpyObj('BalanceCacheService', {
      coin: Promise.resolve({ balance: 20, price: 5, expiration_date: 1234 }),
      updateCoin: Promise.resolve(),
      total: Promise.resolve(5000),
      updateTotal: Promise.resolve(),
    });

    contentSpy = jasmine.createSpyObj('IonContent', { scrollToTop: Promise.resolve() });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('StorageService', {
      get: Promise.resolve(false),
    });

    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', {
      getObject: [{ test: 'test' }],
    });

    twoPiProductFactorySpy = jasmine.createSpyObj('TwoPiProductFactory', {
      create: {
        id: () => 1,
      },
    });

    twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
      vault: Promise.resolve({
        apy: 0.227843965358873,
        balances: [],
        contract_address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
        deposits: [],
        identifier: 'polygon_usdc',
        pid: 1,
        token: 'USDC',
        token_address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
        tvl: 1301621680000,
      } as Vault),
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(new FakeWallet()) },
    });

    base64ImageFactorySpy = jasmine.createSpyObj('Base64ImageFactory', {
      new: Promise.resolve({
        value: () => {
          return Promise.resolve({});
        },
      }),
    });

    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', { connected: false });
    totalInvestedBalanceOfInjectableSpy = jasmine.createSpyObj('TotalInvestedBalanceOfInjectable', {
      create: new FakeTotalInvestedBalanceOf(Promise.resolve(15.6)),
    });

    notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', {
      getInstance: new NullNotificationsService(),
    });
    TestBed.configureTestingModule({
      declarations: [HomeWalletPage, FakeTrackClickDirective, HideTextPipe, FakeFeatureFlagDirective],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule, ReactiveFormsModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
        { provide: RefreshTimeoutService, useValue: refreshTimeoutServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: BalanceCacheService, useValue: balanceCacheServiceSpy },
        { provide: CovalentBalancesInjectable, useValue: covalentBalancesInjectableSpy },
        { provide: TokenPricesInjectable, useValue: tokenPricesInjectableSpy },
        { provide: TotalBalanceInjectable, useValue: totalBalanceInjectableSpy },
        { provide: TokenDetailInjectable, useValue: tokenDetailInjectableSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        { provide: TwoPiProductFactory, useValue: twoPiProductFactorySpy },
        { provide: TwoPiApi, useValue: twoPiApiSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: Base64ImageFactory, useValue: base64ImageFactorySpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
        { provide: WCService, useValue: walletConnectServiceSpy },
        { provide: UpdateNewsService, useValue: updateNewsServiceSpy },
        { provide: TotalInvestedBalanceOfInjectable, useValue: totalInvestedBalanceOfInjectableSpy },
        { provide: ContactDataService, useValue: contactDataServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeWalletPage);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;
    component.content = contentSpy;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize on view did enter', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.userTokens.length).toBeGreaterThan(0);
    expect(component.tokenDetails.length).toBeGreaterThan(0);
    expect(updateNewsServiceSpy.showModal).toHaveBeenCalledTimes(1);
  });

  it('should initialize on view did enter without tokens', async () => {
    storageServiceSpy.getAssetsSelected.and.returnValue(Promise.resolve([]));
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.userTokens.length).toEqual(0);
    expect(component.tokenDetails.length).toEqual(0);
  });

  it('should re-initialize when refresher is triggered', fakeAsync(() => {
    const eventMock = { target: { complete: jasmine.createSpy('complete') } };
    const spy = spyOn(component, 'initialize');
    component.ionViewDidEnter();
    tick();
    fixture.debugElement.query(By.css('ion-refresher')).triggerEventHandler('ionRefresh', eventMock);
    fixture.detectChanges();
    tick(1000);

    expect(spy).toHaveBeenCalled();
    expect(eventMock.target.complete).toHaveBeenCalledTimes(1);
    expect(refreshTimeoutServiceSpy.lock).toHaveBeenCalledTimes(1);
  }));

  it('should not re-initialize when refresher is not available', fakeAsync(() => {
    refreshTimeoutServiceSpy.isAvailable.and.returnValue(false);
    const eventMock = { target: { complete: jasmine.createSpy('complete') } };
    const spy = spyOn(component, 'initialize');
    tick();
    fixture.debugElement.query(By.css('ion-refresher')).triggerEventHandler('ionRefresh', eventMock);
    tick(1000);

    expect(spy).not.toHaveBeenCalled();
    expect(eventMock.target.complete).toHaveBeenCalledTimes(1);
    expect(refreshTimeoutServiceSpy.lock).not.toHaveBeenCalled();
  }));

  it('should call appTrackEvent on trackService when Edit Tokens clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Tokens');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render app-backup-information-card component', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(false);
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();

    const componentEl = fixture.debugElement.query(By.css('div.wt__backup app-backup-information-card'));

    expect(componentEl).toBeTruthy();
  });

  it('should not render app-backup-information-card component when wallets exist and is protected', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(true);
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();

    const componentEl = fixture.debugElement.query(By.css('div.wt__backup app-backup-information-card'));

    expect(componentEl).toBeFalsy();
  });

  it('should navigate when Edit Tokens button is clicked', async () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Edit Tokens"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/select-coins', 'edit']);
  });

  it('should show 0.0 balance when no wallet nor cache is present', async () => {
    balanceCacheServiceSpy.total.and.resolveTo(undefined);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const balanceEl = fixture.debugElement.query(By.css('div.wt__amount-and-eye__amount > ion-text'));
    expect(balanceEl.nativeElement.innerHTML).toContain('0.00');
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should render app-eye component', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const componentEl = fixture.debugElement.queryAll(By.css('app-eye'));
    fixture.detectChanges();
    expect(componentEl).toBeTruthy();
  });

  it('should render app-transaction-in-progress-card component', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const componentEl = fixture.debugElement.queryAll(By.css('app-transaction-in-progress-card'));
    fixture.detectChanges();
    expect(componentEl).toBeTruthy();
  });

  it('should render home-slides component', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const componentEl = fixture.debugElement.queryAll(By.css('app-home-slides'));
    fixture.detectChanges();
    expect(componentEl).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when Tokens Tab was clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-segment-button', 'ux_tab_tokens');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call appTrackEvent on trackService when NFTs Tab was clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-segment-button', 'ux_tab_nfts');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get on storage onInit', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(ionicStorageServiceSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should go to backup wallet when info card is clicked', () => {
    component.protectedWallet = false;
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('app-backup-information-card'));
    card.triggerEventHandler('cardClicked', null);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/recovery/read');
  });

  it('should render total invested correctly', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const totalInvestedEl = fixture.debugElement.query(By.css('ion-text.wt__total-invested__text'));
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(component.totalInvested).toEqual(15.6);
    expect(totalInvestedEl.nativeElement.innerHTML).toContain('15.60 USD');
  });

  it('should render correct icon if wallet connect is not connected and redirect to new connection page when icon is clicked', async () => {
    walletConnectServiceSpy.connected.and.returnValue(false);
    component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('ion-icon[name="ux-walletconnect"]'));
    iconEl.nativeElement.click();
    expect(iconEl).toBeTruthy();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/wallet-connect/new-connection');
  });

  it('should render correct icon if wallet connect is connected and redirect to connection detail page when icon is clicked', async () => {
    walletConnectServiceSpy.connected.and.returnValue(true);
    component.ionViewWillEnter();
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('ion-icon[name="ux-walletconnectconnect"]'));
    iconEl.nativeElement.click();
    expect(iconEl).toBeTruthy();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/wallet-connect/connection-detail');
  });

  it('should call notifications services getInstance on ionViewWillEnter', () => {
    component.ionViewWillEnter();

    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(1);
  });
});
