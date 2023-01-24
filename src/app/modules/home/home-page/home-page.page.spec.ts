import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home-page.page';
import { TranslateModule } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { WalletBalanceService } from '../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { RefreshTimeoutService } from 'src/app/shared/services/refresh-timeout/refresh-timeout.service';
import { BalanceCacheService } from '../../wallets/shared-wallets/services/balance-cache/balance-cache.service';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';
import { TotalBalanceInjectable } from '../../wallets/shared-wallets/models/balance/total-balance/total-balance-injectable.service';
import { TokenPricesController } from '../../wallets/shared-wallets/models/prices/token-prices/token-prices.controller';
import { CovalentBalancesInjectable } from '../../wallets/shared-wallets/models/balances/covalent-balances/covalent-balances-injectable.service';
import { TokenDetailController } from '../../wallets/shared-wallets/models/token-detail/token-detail.controller';
import { TokenDetail } from '../../wallets/shared-wallets/models/token-detail/token-detail';
import { FakeBalance } from '../../wallets/shared-wallets/models/balance/fake-balance/fake-balance';
import { FakePrices } from '../../wallets/shared-wallets/models/prices/fake-prices/fake-prices';
import { FakeBalances } from '../../wallets/shared-wallets/models/balances/fake-balances/fake-balances';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletBackupService } from '../../wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WalletsFactory } from '../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeWallet } from '../../swaps/shared-swaps/models/wallet/wallet';
import { rawETHData, rawMATICData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';

const dataTest = {
  category: 'purchases',
  expenses: 700,
  income: 1000,
  name: 'Auto',
  necessaryAmount: 2500,
};

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let windowSpy: any;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let refreshTimeoutServiceSpy: jasmine.SpyObj<RefreshTimeoutService>;
  let balanceCacheServiceSpy: jasmine.SpyObj<BalanceCacheService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let coinSpy: jasmine.SpyObj<Coin>;
  let totalBalanceInjectableSpy: jasmine.SpyObj<TotalBalanceInjectable>;
  let tokenPricesControllerSpy: jasmine.SpyObj<TokenPricesController>;
  let covalentBalancesInjectableSpy: jasmine.SpyObj<CovalentBalancesInjectable>;
  let tokenDetailControllerSpy: jasmine.SpyObj<TokenDetailController>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let walletsFactorySpy: jasmine.SpyObj<WalletsFactory>;

  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  beforeEach(waitForAsync(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { logoRoute: '', value: 'ETH', name: 'Ethereum', network: 'ERC20' });
    totalBalanceInjectableSpy = jasmine.createSpyObj('TotalBalanceInjectable', { create: new FakeBalance(10) });
    tokenPricesControllerSpy = jasmine.createSpyObj('TokenPricesController', { new: new FakePrices() });
    covalentBalancesInjectableSpy = jasmine.createSpyObj('CovalentBalancesInjectable', { create: new FakeBalances() });
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
    tokenDetailControllerSpy = jasmine.createSpyObj('TokenDetailSpy', { new: tokenDetailSpy });
    windowSpy = spyOn(window, 'open');

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    balanceCacheServiceSpy = jasmine.createSpyObj('BalanceCacheService', {
      coin: Promise.resolve({ balance: 20, price: 5, expiration_date: 1234 }),
      updateCoin: Promise.resolve(),
      total: Promise.resolve(5000),
      updateTotal: Promise.resolve(),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getNetworks: ['MATIC'] });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getAssetsSelected: Promise.resolve([rawETHData, rawMATICData]),
      getWalletsAddresses: Promise.resolve('0x00001'),
    });

    fakeWalletService = new FakeWalletService(true);
    walletServiceSpy = fakeWalletService.createSpy();
    walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', {
      balanceOf: Promise.resolve(20),
      priceOf: Promise.resolve(10),
    });

    refreshTimeoutServiceSpy = jasmine.createSpyObj('RefreshTimeoutService', {
      isAvailable: true,
      lock: of(),
      unsubscribe: of(),
    });

    appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', { get: dataTest });

    walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', {
      presentModal: Promise.resolve('skip'),
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: null,
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', { trackEvent: Promise.resolve(true) });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(new FakeWallet()) },
    });

    TestBed.configureTestingModule({
      declarations: [HomePage, FakeFeatureFlagDirective],
      imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
        { provide: RefreshTimeoutService, useValue: refreshTimeoutServiceSpy },
        { provide: BalanceCacheService, useValue: balanceCacheServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: CovalentBalancesInjectable, useValue: covalentBalancesInjectableSpy },
        { provide: TokenPricesController, useValue: tokenPricesControllerSpy },
        { provide: TotalBalanceInjectable, useValue: totalBalanceInjectableSpy },
        { provide: TokenDetailController, useValue: tokenDetailControllerSpy },
        { provide: AppStorageService, useValue: appStorageServiceSpy },
        { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe refresh timeout service on ionViewDidLeave', () => {
    component.ionViewDidLeave();
    expect(refreshTimeoutServiceSpy.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should not get balance if wallet does not exist', async () => {
    fakeWalletService.modifyReturns(false, null);
    await component.ionViewDidEnter();
    await fixture.whenStable();
    component.ionViewDidLeave();
    expect(walletServiceSpy.walletExist).toHaveBeenCalledTimes(1);
    expect(component.balance).not.toBeDefined();
  });

  it('should get balance if wallet exists', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    component.ionViewDidLeave();
    expect(walletServiceSpy.walletExist).toHaveBeenCalledTimes(1);
    expect(storageServiceSpy.getAssetsSelected).toHaveBeenCalledTimes(1);
    expect(component.balance).toEqual(10);
    expect(balanceCacheServiceSpy.total).toHaveBeenCalledTimes(1);
    expect(balanceCacheServiceSpy.updateTotal).toHaveBeenCalledTimes(1);
  });

  it('should navigate to buy conditions page when Buy Cripto Card is clicked, wallet exist and conditionsPurchasesAccepted is not set on storage ', async () => {
    fakeWalletService.modifyReturns(true, null);
    component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-buy-crypto-card')).triggerEventHandler('clicked', 'true');
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/buy-conditions']);
  });

  it('should navigate to token selection page when Buy Cripto Card is clicked, wallet exist and conditionsPurchasesAccepted is set on storage ', async () => {
    fakeWalletService.modifyReturns(true, null);
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve('true'));
    component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-buy-crypto-card')).triggerEventHandler('clicked', 'true');
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/token-selection']);
  });

  it('should not navigate when closing backup modal without skipping', async () => {
    fakeWalletService.modifyReturns(true, null);
    walletBackupServiceSpy.presentModal.and.resolveTo('close');
    component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-buy-crypto-card')).triggerEventHandler('clicked', 'true');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });

  it('should not navigate when closing backup modal when clicking backup', async () => {
    fakeWalletService.modifyReturns(true, null);
    walletBackupServiceSpy.presentModal.and.resolveTo('backup');
    component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-buy-crypto-card')).triggerEventHandler('clicked', 'true');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });

  it('should re-initialize when refresher is triggered', fakeAsync(() => {
    component.quotesCardComponent = jasmine.createSpyObj('QuotesCardComponent', { ngOnInit: null });
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

  it('should render app-objetive-card and no render app-financial-planner-card component if there is data in the storage', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const componentEl = fixture.debugElement.query(By.css('app-financial-planner-card'));
    const componentObjetiveEl = fixture.debugElement.query(By.css('div.ux-card'));
    expect(appStorageServiceSpy.get).toHaveBeenCalledTimes(1);
    expect(componentEl).toBeFalsy();
    expect(componentObjetiveEl).toBeTruthy();
  });

  it('should render app-financial-planner-card and no render app-objetive-card component if there isnt data in the storage', async () => {
    appStorageServiceSpy.get.and.returnValue(null);
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const componentEl = fixture.debugElement.query(By.css('app-financial-planner-card'));
    const componentObjetiveEl = fixture.debugElement.query(By.css('div.ux-card'));
    expect(appStorageServiceSpy.get).toHaveBeenCalledTimes(1);
    expect(componentEl).toBeTruthy();
    expect(componentObjetiveEl).toBeFalsy();
  });

  it('should navigate to objetive page when objetive card is clicked', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.ux-card .card-objetive')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/financial-planner/result-objetive']);
  });

  it('should show Buy Crypto Card if user has wallet', async () => {
    fakeWalletService.modifyReturns(true, null);
    await component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const cardEl = fixture.debugElement.query(By.css('app-buy-crypto-card[name="Buy Cripto Card"]'));
    expect(cardEl).toBeTruthy();
  });

  it('should not show Buy Crypto Card if user has not created wallet', async () => {
    fakeWalletService.modifyReturns(false, null);
    await component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const cardEl = fixture.debugElement.query(By.css('app-buy-crypto-card[name="Buy Cripto Card"]'));
    expect(cardEl).toBeFalsy();
  });

  it('should not show Donations Card if user has not created wallet', async () => {
    fakeWalletService.modifyReturns(false, null);
    await component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const cardEl = fixture.debugElement.query(By.css('app-donations-card'));
    expect(cardEl).toBeFalsy();
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
