import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick, flush, discardPeriodicTasks, flushMicrotasks } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { SelectCoinsWalletPage } from './select-coins-wallet.page';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { WalletMaintenanceService } from '../shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import {
  TEST_BSC_BEP20_COINS,
  TEST_COINS,
  TEST_ERC20_COINS,
  TEST_MATIC_COINS,
  TEST_RSK_COINS,
  TEST_SOLANA_COINS,
} from '../shared-wallets/constants/coins.test';
import { SELECT_COINS_FORM_DATA } from './form-data.spec';
import { RouterTestingModule } from '@angular/router/testing';

describe('SelectCoinsWalletPage', () => {
  let component: SelectCoinsWalletPage;
  let fixture: ComponentFixture<SelectCoinsWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectCoinsWalletPage>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletMaintenanceServiceSpy: jasmine.SpyObj<WalletMaintenanceService>;

  const testDynamicFormValue = {
    test1: {
      TNC: false,
      TC: false,
    },
    test2: {
      TNT: false,
    },
    updateOn: jasmine.anything(),
  };

  const testCoinValuesForDynamicForm: Array<Coin[]> = [
    [
      jasmine.createSpyObj('TestNativeCoin', {}, { value: 'TNC', network: 'test1', native: true }),
      jasmine.createSpyObj('TestNotNativeCoin', {}, { value: 'TC', network: 'test1' }),
    ],
    [
      jasmine.createSpyObj('TestNativeToken', {}, { value: 'TNT', network: 'test2', native: true }),
    ]
  ];

  const testSelectedTokens = [TEST_COINS[0], TEST_COINS[2], TEST_COINS[4], TEST_COINS[5], TEST_COINS[7], TEST_COINS[8]];

  const formData = SELECT_COINS_FORM_DATA;

  const testSuites = {
    ERC20: TEST_ERC20_COINS,
    MATIC: TEST_MATIC_COINS,
    RSK: TEST_RSK_COINS,
    BSC_BEP20: TEST_BSC_BEP20_COINS,
    SOLANA: TEST_SOLANA_COINS,
  };

  beforeEach(waitForAsync(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getNetworks: ['ERC20', 'RSK', 'MATIC', 'BSC_BEP20', 'SOLANA'],
      getCoinsFromNetwork: undefined,
    });
    apiWalletServiceSpy.getCoinsFromNetwork.and.callFake((network) => testSuites[network]);

    walletMaintenanceServiceSpy = jasmine.createSpyObj('WalletMaintenanceService', {
      getUserAssets: Promise.resolve(testSelectedTokens),
      updateTokensStorage: Promise.resolve(),
      wipeDataFromService: null,
    });
    TestBed.configureTestingModule({
      declarations: [SelectCoinsWalletPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ReactiveFormsModule],
      providers: [
        TrackClickDirective,
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletMaintenanceService, useValue: walletMaintenanceServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCoinsWalletPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form dinamically on ionViewWillEnter', () => {
    apiWalletServiceSpy.getNetworks.and.returnValue(['test1', 'test2']);
    apiWalletServiceSpy.getCoinsFromNetwork.and.returnValues(...testCoinValuesForDynamicForm);
    component.createForm();
    expect(component.form.value).toEqual(testDynamicFormValue);
  });

  it('should get user coins on ionViewWillEnter', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    expect(component.userCoinsLoaded).toBeTrue();
    expect(component.form.value).toEqual(formData.editTokensOriginal);
    expect(walletMaintenanceServiceSpy.updateTokensStorage).not.toHaveBeenCalled();
    flush();
  }));

  it('should autosave when form updates', fakeAsync(() => {
    const assets = {
      ETH: true,
      UNI: true,
      LINK: false,
      USDT: false,
      MATIC: true,
      RBTC: false,
      RIF: false,
      BNB: false,
      SOL: true,
    };
    fixture.detectChanges();
    component.ionViewWillEnter();
    tick();
    component.form.patchValue(formData.valid);
    tick(150);
    expect(walletMaintenanceServiceSpy.updateTokensStorage).toHaveBeenCalledOnceWith(assets);
    flush();
  }));

  it('should autosave once when form updates multiple times', fakeAsync(() => {
    const assets = {
      ETH: true,
      UNI: true,
      LINK: false,
      USDT: false,
      MATIC: true,
      RBTC: false,
      RIF: false,
      BNB: false,
      SOL: true,
    };
    fixture.detectChanges();
    component.ionViewWillEnter();
    tick();
    component.form.patchValue(formData.invalid);
    component.form.patchValue(formData.valid);
    component.form.patchValue(formData.invalid);
    component.form.patchValue(formData.valid);
    tick(150);
    expect(walletMaintenanceServiceSpy.updateTokensStorage).toHaveBeenCalledOnceWith(assets);
    flush();
  }));

  it('should set all values to true when ux_create_all clicked and all values are false', async () => {
    walletMaintenanceServiceSpy.getUserAssets.and.resolveTo([]);
    fixture.detectChanges();
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-toggle[name="ux_create_all"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.form.value).toEqual(formData.allTrue);
  });

  it('should set all values to true when ux_create_all clicked and some values are true', async () => {
    walletMaintenanceServiceSpy.getUserAssets.and.resolveTo(testSelectedTokens);
    fixture.detectChanges();
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-toggle[name="ux_create_all"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.form.value).toEqual(formData.allTrue);
  });

  it('should set all values to false when ux_create_all clicked and all values are true', async () => {
    walletMaintenanceServiceSpy.getUserAssets.and.resolveTo(TEST_COINS);
    fixture.detectChanges();
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-toggle[name="ux_create_all"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.form.value).toEqual(formData.invalid);
  });

  it('should change activate toggle when toggle changes and all values are true', async () => {
    walletMaintenanceServiceSpy.getUserAssets.and.resolveTo(TEST_COINS);
    fixture.detectChanges();
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement
      .queryAll(By.css('app-items-coin-group'))[0]
      .triggerEventHandler('changed', { detail: { checked: true, value: TEST_ERC20_COINS[0] } });
    fixture.detectChanges();
    await fixture.whenStable();
    const toggle = fixture.debugElement.query(By.css('ion-toggle[name="ux_create_all"]'));
    expect(toggle.nativeElement.checked).toBeTrue();
  });

  it('should change the toggle value when at least one element is not true', fakeAsync(() => {
    walletMaintenanceServiceSpy.getUserAssets.and.resolveTo(testSelectedTokens);
    fixture.detectChanges();
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();
    fixture.debugElement
      .queryAll(By.css('app-items-coin-group'))[0]
      .triggerEventHandler('changed', { detail: { checked: true, value: TEST_ERC20_COINS[0] } });
    fixture.detectChanges();
    tick();
    const toggle = fixture.debugElement.query(By.css('ion-toggle[name="ux_create_all"]'));
    expect(toggle.nativeElement.checked).toBeFalse();
    flush();
  }));
});
