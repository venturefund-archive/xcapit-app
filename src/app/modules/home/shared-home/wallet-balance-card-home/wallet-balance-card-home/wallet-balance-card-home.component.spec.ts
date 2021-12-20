import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { promise } from 'protractor';
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

fdescribe('WalletBalanceCardHomeComponent', () => {
  let component: WalletBalanceCardHomeComponent;
  let fixture: ComponentFixture<WalletBalanceCardHomeComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletBalanceCardHomeComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let localStorageService: LocalStorageService;
  let localStorageServiceSpy: any;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let WalletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      localStorageServiceSpy = {
        toggleHideFunds: () => promise,
        getHideFunds: () => Promise.resolve(true),
      };
      fakeWalletService = new FakeWalletService();
      walletServiceSpy = fakeWalletService.createSpy();
      WalletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', {
        getWalletsBalances: Promise.resolve(balances),
        getUsdTotalBalance: Promise.resolve(),
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
      fixture.detectChanges();
      localStorageService = TestBed.inject(LocalStorageService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when Import Wallet clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'Go To Home Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call navigateForward in goToTutorialAPIKey ', () => {
    fixture.debugElement.query(By.css('div[name="Go To Home Wallet"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['tabs/wallets']);
  });

  it('should call toggleHideFunds in HideText', () => {
    component.walletExist = true;
    component.ngOnInit();
    fixture.detectChanges();
    const spyToggle = spyOn(localStorageService, 'toggleHideFunds');
    spyToggle.and.returnValue(undefined);
    component.hideText();
    expect(localStorageServiceSpy.toggleHideFunds).toHaveBeenCalledTimes(1);
  });
});
