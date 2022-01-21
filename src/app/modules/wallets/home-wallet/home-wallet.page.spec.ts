import { BalanceCacheService } from '../shared-wallets/services/balance-cache/balance-cache.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { IonContent, IonicModule, IonInfiniteScroll, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeWalletPage } from './home-wallet.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { isObservable, of } from 'rxjs';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { WalletBalanceService } from '../shared-wallets/services/wallet-balance/wallet-balance.service';
import { RefreshTimeoutService } from 'src/app/shared/services/refresh-timeout/refresh-timeout.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { TEST_ERC20_COINS } from '../shared-wallets/constants/coins.test';
import { QueueService } from '../../../shared/services/queue/queue.service';

const balances: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/LINK.svg',
    symbol: 'LINK',
    name: 'LINK - Chainlink',
    amount: 0.005,
    usdAmount: 120,
    usdSymbol: 'USD',
  },
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'ETH - Ethereum',
    amount: 1,
    usdAmount: 2000,
    usdSymbol: 'USD',
  },
  {
    icon: 'assets/img/coins/USDT.svg',
    symbol: 'USDT',
    name: 'USDT - Tether',
    amount: 2,
    usdAmount: 3000,
    usdSymbol: 'USD',
  },
];

describe('HomeWalletPage', () => {
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
  let ionInfiniteScrollSpy: jasmine.SpyObj<IonInfiniteScroll>;
  let queueServiceSpy: jasmine.SpyObj<QueueService>;
  let contentSpy: jasmine.SpyObj<IonContent>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getNFTStatus: of({ status: 'claimed' }),
        createNFTRequest: of({}),
        getNetworks: ['ERC20'],
      });

      fakeWalletService = new FakeWalletService(true);
      walletServiceSpy = fakeWalletService.createSpy();

      walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', {
        getWalletsBalances: Promise.resolve(balances),
        getUsdTotalBalance: Promise.resolve(5120),
        balanceOf: Promise.resolve(20),
        priceOf: Promise.resolve(10),
      });

      refreshTimeoutServiceSpy = jasmine.createSpyObj('RefreshTimeoutService', {
        isAvailable: true,
        lock: of(),
      });

      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getAssestsSelected: Promise.resolve(TEST_ERC20_COINS),
      });

      balanceCacheServiceSpy = jasmine.createSpyObj('BalanceCacheService', {
        coin: Promise.resolve({ balance: 20, price: 5, expiration_date: 1234 }),
        updateCoin: Promise.resolve(),
      });

      ionInfiniteScrollSpy = jasmine.createSpyObj('IonInfiniteScroll', { complete: Promise.resolve() });

      queueServiceSpy = jasmine.createSpyObj('QueueService', {
        create: null,
        enqueue: null,
        results: of({}),
      });
      queueServiceSpy.enqueue.and.callFake((queue, task) => (isObservable(task) ? task : task()));
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
          { provide: QueueService, useValue: queueServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeWalletPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      component.infiniteScroll = ionInfiniteScrollSpy;
      component.content = contentSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should initialize on view did enter', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.walletExist).toBeTrue();
    expect(component.selectedAssets.length).toBeGreaterThan(0);
    expect(component.nftStatus).toEqual('claimed');
    expect(component.balances.length).toBeGreaterThan(0);
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

  it('should not load more balances when ends', async () => {
    component.walletExist = true;
    component.selectedAssets = [];
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-infinite-scroll')).triggerEventHandler('ionInfinite', null);
    expect(component.infiniteScroll.disabled).toBeTrue();
  });

  it('should call appTrackEvent on trackService when Import Wallet clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Import Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate when Import Wallet button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Import Wallet"]')).nativeElement.click();
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

  it('should request the nft and update the nft status to claimed when claim event is received', () => {
    component.segmentsForm.patchValue({ tab: 'nft' });
    component.nftStatus = 'unclaimed';
    component.walletExist = true;
    fixture.detectChanges();
    const claimNFTCardComponent = fixture.debugElement.query(By.css('app-nft-card'));
    claimNFTCardComponent.triggerEventHandler('nftRequest', null);
    fixture.detectChanges();
    expect(component.nftStatus).toEqual('claimed');
  });

  it('should unsubscribe on did leave', () => {
    const spy = jasmine.createSpyObj('Subscription', { unsubscribe: null });
    component.subscriptions$ = [spy];
    fixture.detectChanges();
    component.ionViewDidLeave();
    expect(spy.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
