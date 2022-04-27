import { ActivatedRoute } from '@angular/router';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { MoonpayPage } from './moonpay.page';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';

const testCoins = [
  {
    id: 2,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    moonpayCode: 'eth',
    rpc: 'http://testrpc.test',
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.test',
  },
  {
    id: 3,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    moonpayCode: 'usdt',
    rpc: 'http://testrpc.test',
    decimals: 6,
  },
];

const rawOperations: FiatRampOperation[] = [
  {
    operation_id: 1,
    amount_in: 12,
    currency_in: 'ETH',
    amount_out: 21,
    currency_out: 'ARS',
    status: 'complete',
    created_at: new Date(),
    provider: '1',
    operation_type: 'cash-in'
  },
  {
    operation_id: 2,
    amount_in: 23,
    currency_in: 'USDT',
    amount_out: 21,
    currency_out: 'ARS',
    status: 'complete',
    created_at: new Date(),
    provider: '1',
    operation_type: 'cash-in'
  },
  {
    operation_id: 3,
    amount_in: 32,
    currency_in: 'ETH',
    amount_out: 21,
    currency_out: 'ARS',
    status: 'complete',
    created_at: new Date(),
    provider: '1',
    operation_type: 'cash-in'
  },
]

describe('MoonpayPage', () => {
  let component: MoonpayPage;
  let fixture: ComponentFixture<MoonpayPage>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<MoonpayPage>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      fakeActivatedRoute = new FakeActivatedRoute({ asset: '' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsServiceSpy', {
        getUserOperations: of(rawOperations),
        getMoonpayLink: of({ url: 'http://testURL.com' }),
      });
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getEncryptedWallet: Promise.resolve({ addresses: { ERC20: 'testERC20Address' } }),
      });
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getAssestsSelected: Promise.resolve(testCoins),
      });
      TestBed.configureTestingModule({
        declarations: [MoonpayPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
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

  it('should open in app browser and redirect to tabs wallets when Continue to Moonpay is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Continue to Moonpay"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'http://testURL.com' });
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/wallets']);
  });

  it('should select default currency and get user wallet address for the network of the currency selected on init', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(component.form.value.currency).toEqual(testCoins[0]);
    expect(component.address).toEqual('testERC20Address');
  });

  it('should select the currency specified by parameter on init', async () => {
    fakeActivatedRoute.modifySnapshotParams({ asset: 'USDT' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.currency).toEqual(testCoins[2]);
  });

  it('should filter the currencies selected by the user and leave only those with a valid moonpay code on init', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.coins.length).toEqual(2);
  });

  it('should get and show operations on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fiatRampsServiceSpy.getUserOperations).toHaveBeenCalledTimes(1);
    expect(component.operationsList.length).toEqual(3);
  });

  it('should go to Moonpay web when Go To Moonpay History clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Go To Moonpay History"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent when Go To Moonpay History clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Moonpay History');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
