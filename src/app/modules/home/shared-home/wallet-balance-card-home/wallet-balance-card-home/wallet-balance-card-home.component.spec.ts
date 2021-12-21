import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AssetBalance } from 'src/app/modules/wallets/shared-wallets/interfaces/asset-balance.interface';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { HideTextPipe } from 'src/app/shared/pipes/hide-text/hide-text.pipe';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { WalletBalanceCardHomeComponent } from './wallet-balance-card-home.component';

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

describe('WalletBalanceCardHomeComponent', () => {
  let component: WalletBalanceCardHomeComponent;
  let fixture: ComponentFixture<WalletBalanceCardHomeComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletBalanceCardHomeComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let localStorageService: LocalStorageService;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let WalletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      localStorageServiceSpy = jasmine.createSpyObj(
        'LocalStorageService',
        {
          toggleHideFunds: undefined,
        },
        { hideFunds: of(false) }
      );
      localStorageServiceSpy.toggleHideFunds.and.callThrough();
      fakeWalletService = new FakeWalletService(true);
      walletServiceSpy = fakeWalletService.createSpy();
      WalletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', {
        getWalletsBalances: Promise.resolve(balances),
        getUsdTotalBalance: Promise.resolve(5120),
      });
      TestBed.configureTestingModule({
        declarations: [WalletBalanceCardHomeComponent, HideTextPipe, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), IonicModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: LocalStorageService, useValue: localStorageServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: WalletBalanceService, useValue: WalletBalanceServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletBalanceCardHomeComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      localStorageService = TestBed.inject(LocalStorageService);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when Go To Home Wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'Go To Home Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to home wallet when Go To Home Wallet is clicked', () => {
    fixture.debugElement.query(By.css('div[name="Go To Home Wallet"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['tabs/wallets']);
  });

  it('should show balance when wallet exist and there is balance', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const divEl = fixture.debugElement.query(By.css('div.wbc__content_balance__body__balance'));
    expect(divEl.nativeElement.innerHTML).toContain('5,120.00');
  });

  it('should show zero balance when wallet exist and there is not balance', async () => {
    WalletBalanceServiceSpy.getUsdTotalBalance.and.resolveTo();
    fixture.detectChanges();
    await fixture.whenStable();
    const divEl = fixture.debugElement.query(By.css('div.wbc__content_balance__body__balance'));
    expect(divEl.nativeElement.innerHTML).toContain('0.00');
  });

  it('should show title and subtitle when wallet not exist', async () => {
    fakeWalletService.modifyReturns(false, null);
    component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('div.wbc__content__body__title'));
    const subtitleEl = fixture.debugElement.query(By.css('div.wbc__content__body__subtitle'));
    expect(titleEl.nativeElement.innerHTML).toContain('home.home_page.want_my_wallet.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('home.home_page.want_my_wallet.subtitle');
  });

  it('should hide balance when eye button is clicked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const eyeEl = fixture.debugElement.query(By.css('a.wbc__content_balance__body__eye-button'));
    eyeEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(localStorageServiceSpy.toggleHideFunds).toHaveBeenCalled();
    component.hideFundText = true;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.wbc__content_balance__body__balance'));
    expect(divEl.nativeElement.innerHTML).toContain('****');
  });
});
