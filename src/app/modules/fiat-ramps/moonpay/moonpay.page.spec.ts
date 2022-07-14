import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { MoonpayPage } from './moonpay.page';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TEST_COINS } from '../../wallets/shared-wallets/constants/coins.test';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WalletMaintenanceService } from '../../wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';

const testWallet = {
  assets: {
    ETH: true,
    LINK: false,
    UNI: true,
    MATIC: true,
  },
  addresses: { 
    ERC20: 'testERC20Address',
    MATIC: 'testMaticAddress'
  }
};

const formValid = {
  currency: TEST_COINS[0],
};

describe('MoonpayPage', () => {
  let component: MoonpayPage;
  let fixture: ComponentFixture<MoonpayPage>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<MoonpayPage>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletMaintenanceServiceSpy: jasmine.SpyObj<WalletMaintenanceService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      fakeActivatedRoute = new FakeActivatedRoute({}, { country: 'COL' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsServiceSpy', {
        getMoonpayLink: of({ url: 'http://testURL.com' }),
      });
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoins: TEST_COINS,
      });
      walletMaintenanceServiceSpy = jasmine.createSpyObj("WalletMaintenanceService", {
        getEncryptedWalletFromStorage: Promise.resolve(),
        addCoinIfUserDoesNotHaveIt: Promise.resolve(),
        wipeDataFromService: null
      }, {
        encryptedWallet: testWallet
      });
      TestBed.configureTestingModule({
        declarations: [MoonpayPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule],
        providers: [
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletMaintenanceService, useValue: walletMaintenanceServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(MoonpayPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open in app browser and redirect to tabs wallets when ux_buy_moonpay_continue is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_buy_moonpay_continue"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'http://testURL.com' });
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/wallets']);
  });

  it("should call addCoinIfUserDoesNotHaveIt when transaction completes", async () => {
    const coin: jasmine.SpyObj<Coin> = jasmine.createSpyObj("Coin", {}, { value: "USDT", network: "ERC20" });
    component.form.patchValue({currency: coin});
    fixture.debugElement.query(By.css('ion-button[name="ux_buy_moonpay_continue"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(walletMaintenanceServiceSpy.addCoinIfUserDoesNotHaveIt).toHaveBeenCalledOnceWith(coin);
  });

  it("should call wipeDataFromService on ionViewDidLeave", () => {
    component.ionViewDidLeave();
    expect(walletMaintenanceServiceSpy.wipeDataFromService).toHaveBeenCalledTimes(1);
  });

  it('should select default currency and get user wallet address for the network of the currency selected on init', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(component.form.value.currency).toEqual(TEST_COINS[0]);
    expect(component.address).toEqual('testERC20Address');
  });

  it('should select the currency specified by parameter on init', async () => {
    fakeActivatedRoute.modifySnapshotParams({}, { country: 'COL', asset: 'MATIC', network: 'MATIC' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(component.form.value.currency).toEqual(TEST_COINS[6]);
  });

  it('should redirect to change currency when currency button is clicked on provider card', async () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        country: 'COL',
      },
    };
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue(formValid);
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-provider-new-operation-card'))
      .triggerEventHandler('changeCurrency', undefined);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/fiat-ramps/token-selection', 'moonpay'], navigationExtras);
  });
});
