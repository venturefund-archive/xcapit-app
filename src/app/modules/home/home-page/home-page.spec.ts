import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { HomePage } from './home-page.page';
import { TranslateModule } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of, Subscription, throwError } from 'rxjs';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
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
import { TotalBalanceController } from '../../wallets/shared-wallets/models/balance/total-balance/total-balance.controller';
import { TokenPricesController } from '../../wallets/shared-wallets/models/prices/token-prices/token-prices.controller';
import { CovalentBalancesController } from '../../wallets/shared-wallets/models/balances/covalent-balances/covalent-balances.controller';
import { TokenDetailController } from '../../wallets/shared-wallets/models/token-detail/token-detail.controller';
import { TokenDetail } from '../../wallets/shared-wallets/models/token-detail/token-detail';
import { FakeBalance } from '../../wallets/shared-wallets/models/balance/fake-balance/fake-balance';
import { FakePrices } from '../../wallets/shared-wallets/models/prices/fake-prices/fake-prices';
import { FakeBalances } from '../../wallets/shared-wallets/models/balances/fake-balances/fake-balances';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomePage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let notificationsService: NotificationsService;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let windowSpy: any;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let refreshTimeoutServiceSpy: jasmine.SpyObj<RefreshTimeoutService>;
  let balanceCacheServiceSpy: jasmine.SpyObj<BalanceCacheService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let coinSpy: jasmine.SpyObj<Coin>;

  let totalBalanceControllerSpy: jasmine.SpyObj<TotalBalanceController>;
  let tokenPricesControllerSpy: jasmine.SpyObj<TokenPricesController>;
  let covalentBalancesControllerSpy: jasmine.SpyObj<CovalentBalancesController>;
  let tokenDetailControllerSpy: jasmine.SpyObj<TokenDetailController>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  beforeEach(
    waitForAsync(() => {
      coinSpy = jasmine.createSpyObj('Coin', {}, { logoRoute: '', value: 'ETH', name: 'Ethereum', network: 'ERC20' });
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
      windowSpy = spyOn(window, 'open');
      notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', {
        getCountNotifications: of({ count: 5 }),
      });

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
        getAssestsSelected: Promise.resolve([coinSpy, coinSpy]),
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

      TestBed.configureTestingModule({
        declarations: [HomePage, FakeTrackClickDirective, FakeFeatureFlagDirective],
        imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: NotificationsService, useValue: notificationsServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
          { provide: RefreshTimeoutService, useValue: refreshTimeoutServiceSpy },
          { provide: BalanceCacheService, useValue: balanceCacheServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: CovalentBalancesController, useValue: covalentBalancesControllerSpy },
          { provide: TokenPricesController, useValue: tokenPricesControllerSpy },
          { provide: TotalBalanceController, useValue: totalBalanceControllerSpy },
          { provide: TokenDetailController, useValue: tokenDetailControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(HomePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      notificationsService = TestBed.inject(NotificationsService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Show Notifications button clicked', () => {
    spyOn(component, 'showNotifications');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Show Notifications');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to notifications list when Show Notifications is clicked', () => {
    const button = fixture.debugElement.query(By.css("ion-button[name='Show Notifications']"));
    button.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/notifications/list');
  });

  it('should unsubscribe timerSubscription, notificationQtySubscription on ionViewDidLeave', () => {
    component.ionViewWillEnter();
    const spy = spyOn(Subscription.prototype, 'unsubscribe');
    component.ionViewDidLeave();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should get empty notifications if error', fakeAsync(() => {
    component.notificationInterval = 1;
    fixture.detectChanges();
    notificationsServiceSpy.getCountNotifications.and.returnValue(throwError({}));
    component.ionViewWillEnter();
    tick();
    const spy = spyOn(Subscription.prototype, 'unsubscribe');
    component.ionViewDidLeave();
    expect(spy).toHaveBeenCalledTimes(2);
    discardPeriodicTasks();
    flush();
  }));

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
    expect(storageServiceSpy.getAssestsSelected).toHaveBeenCalledTimes(1);
    expect(component.balance).toEqual(10);
    expect(balanceCacheServiceSpy.total).toHaveBeenCalledTimes(1);
    expect(balanceCacheServiceSpy.updateTotal).toHaveBeenCalledTimes(1);
  });

  it('should navigate to moonpay page when Buy Cripto Card is clicked and wallet exist', async () => {
    fixture.debugElement.query(By.css('app-buy-crypto-card')).triggerEventHandler('clicked', 'true');
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/fiat-ramps/select-provider']);
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
});
