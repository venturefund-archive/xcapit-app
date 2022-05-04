import { BalanceCacheService } from '../shared-wallets/services/balance-cache/balance-cache.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonContent, IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeWalletPage } from './home-wallet.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { WalletBalanceService } from '../shared-wallets/services/wallet-balance/wallet-balance.service';
import { RefreshTimeoutService } from 'src/app/shared/services/refresh-timeout/refresh-timeout.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { By } from '@angular/platform-browser';
import { TotalBalanceController } from '../shared-wallets/models/balance/total-balance/total-balance.controller';
import { FakeBalance } from '../shared-wallets/models/balance/fake-balance/fake-balance';
import { TokenPricesController } from '../shared-wallets/models/prices/token-prices/token-prices.controller';
import { FakePrices } from '../shared-wallets/models/prices/fake-prices/fake-prices';
import { CovalentBalancesController } from '../shared-wallets/models/balances/covalent-balances/covalent-balances.controller';
import { FakeBalances } from '../shared-wallets/models/balances/fake-balances/fake-balances';
import { TokenDetailController } from '../shared-wallets/models/token-detail/token-detail.controller';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';

fdescribe('HomeWalletPage', () => {
  let component: HomeWalletPage;
  let fixture: ComponentFixture<HomeWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomeWalletPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let refreshTimeoutServiceSpy: jasmine.SpyObj<RefreshTimeoutService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let balanceCacheServiceSpy: jasmine.SpyObj<BalanceCacheService>;
  let contentSpy: jasmine.SpyObj<IonContent>;
  let coinSpy: jasmine.SpyObj<Coin>;
  let totalBalanceControllerSpy: jasmine.SpyObj<TotalBalanceController>;
  let tokenPricesControllerSpy: jasmine.SpyObj<TokenPricesController>;
  let covalentBalancesControllerSpy: jasmine.SpyObj<CovalentBalancesController>;
  let tokenDetailControllerSpy: jasmine.SpyObj<TokenDetailController>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      totalBalanceControllerSpy = jasmine.createSpyObj('TotalBalanceController', { new: new FakeBalance(10) });
      tokenPricesControllerSpy = jasmine.createSpyObj('TokenPricesController', { new: new FakePrices() });
      covalentBalancesControllerSpy = jasmine.createSpyObj('CovalentBalancesController', { new: new FakeBalances() });
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
      coinSpy = jasmine.createSpyObj('Coin', {}, { logoRoute: '', value: 'ETH', name: 'Ethereum', network: 'ERC20' });

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        createNFTRequest: of({}),
        getNetworks: ['ERC20'],
      });

      fakeWalletService = new FakeWalletService(true);
      walletServiceSpy = fakeWalletService.createSpy();

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
        getAssestsSelected: Promise.resolve([coinSpy, coinSpy]),
        getWalletsAddresses: Promise.resolve('0x00001'),
      });

      balanceCacheServiceSpy = jasmine.createSpyObj('BalanceCacheService', {
        coin: Promise.resolve({ balance: 20, price: 5, expiration_date: 1234 }),
        updateCoin: Promise.resolve(),
        total: Promise.resolve(5000),
        updateTotal: Promise.resolve(),
      });

      contentSpy = jasmine.createSpyObj('IonContent', { scrollToTop: Promise.resolve() });
      TestBed.configureTestingModule({
        declarations: [HomeWalletPage, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule, ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
          { provide: RefreshTimeoutService, useValue: refreshTimeoutServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: BalanceCacheService, useValue: balanceCacheServiceSpy },
          { provide: CovalentBalancesController, useValue: covalentBalancesControllerSpy },
          { provide: TokenPricesController, useValue: tokenPricesControllerSpy },
          { provide: TotalBalanceController, useValue: totalBalanceControllerSpy },
          { provide: TokenDetailController, useValue: tokenDetailControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeWalletPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      component.content = contentSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize on view did enter', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.walletExist).toBeTrue();
    expect(component.userTokens.length).toBeGreaterThan(0);
    expect(component.tokenDetails.length).toBeGreaterThan(0);
  });

  it('should initialize on view did enter without tokens', async () => {
    storageServiceSpy.getAssestsSelected.and.returnValue(Promise.resolve([]));
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.walletExist).toBeTrue();
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

  it('should call appTrackEvent on trackService when Import Wallet clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_import_import_wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate when Import Wallet button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_import_import_wallet"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/create-first/disclaimer', 'import']);
  });

  it('should call appTrackEvent on trackService when Edit Tokens clicked', () => {
    component.walletExist = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Tokens');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate when Edit Tokens button is clicked', async () => {
    component.walletExist = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Edit Tokens"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/select-coins', 'edit']);
  });

  it('should show 0.0 balance when no wallet nor cache is present', async () => {
    balanceCacheServiceSpy.total.and.resolveTo(undefined);
    await component.ionViewDidEnter();
    component.walletExist = false;
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const balanceEl = fixture.debugElement.query(By.css('div.wt__amount > ion-text'));
    expect(balanceEl.nativeElement.innerHTML).toContain('0.00 USD');
  });
});
