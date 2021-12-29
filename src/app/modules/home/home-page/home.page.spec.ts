import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { HomePage } from './home-page.page';
import { TranslateModule } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of, Subscription } from 'rxjs';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { WalletBalanceService } from '../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { AssetBalance } from '../../wallets/shared-wallets/interfaces/asset-balance.interface';
import { RefreshTimeoutService } from 'src/app/shared/services/refresh-timeout/refresh-timeout.service';

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

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomePage>;
  let navControllerSpy: any;
  let notificationsService: NotificationsService;
  let notificationsServiceMock: any;
  let windowSpy: any;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let refreshTimeoutServiceSpy: jasmine.SpyObj<RefreshTimeoutService>;

  beforeEach(
    waitForAsync(() => {
      windowSpy = spyOn(window, 'open');
      notificationsServiceMock = {
        getCountNotifications: () => of({ count: 5 }),
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

      fakeWalletService = new FakeWalletService(true);
      walletServiceSpy = fakeWalletService.createSpy();
      walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', {
        getWalletsBalances: Promise.resolve(balances),
        getUsdTotalBalance: Promise.resolve(5120),
      });

      refreshTimeoutServiceSpy = jasmine.createSpyObj('RefreshTimeoutService', {
        isAvailable: true,
        lock: of(),
        unsubscribe: of(),
      });

      TestBed.configureTestingModule({
        declarations: [HomePage, FakeTrackClickDirective],
        imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot()],
        providers: [
          {
            provide: NavController,
            useValue: navControllerSpy,
          },
          {
            provide: NotificationsService,
            useValue: notificationsServiceMock,
          },
          {
            provide: WalletService,
            useValue: walletServiceSpy,
          },
          {
            provide: WalletBalanceService,
            useValue: walletBalanceServiceSpy,
          },
          { provide: RefreshTimeoutService, useValue: refreshTimeoutServiceSpy },
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

  it('should return total balance in USDT if wallet exist and alreadyInitialized is false', async () => {
    component.alreadyInitialized = false;
    fixture.detectChanges();
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.totalBalanceWallet).toEqual(5120);
  });

  it('should not return total balance in USDT if wallet exist and alreadyInitialized is true', async () => {
    component.alreadyInitialized = true;
    fakeWalletService.modifyReturns(false, {});
    fixture.detectChanges();
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.totalBalanceWallet).toEqual(undefined);
  });

  it('should not return total balance in USDT if wallet not exist', async () => {
    component.alreadyInitialized = false;
    fakeWalletService.modifyReturns(false, {});
    fixture.detectChanges();
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.totalBalanceWallet).toEqual(undefined);
  });

  it('should call getNFTStatus, encryptedWalletExist and alreadyInitialized is set to false on refresh', async () => {
    await component.doRefresh({ target: { complete: () => null } });
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(walletBalanceServiceSpy.getWalletsBalances).toHaveBeenCalledTimes(1);
    expect(walletBalanceServiceSpy.getUsdTotalBalance).toHaveBeenCalledTimes(1);
    expect(component.alreadyInitialized).toBe(false);
  });
});
