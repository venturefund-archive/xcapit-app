import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick, flush } from '@angular/core/testing';
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
import { StorageAsset } from '../shared-wallets/interfaces/storage-asset.interface';
import { TrackService } from 'src/app/shared/services/track/track.service';

describe('SelectCoinsWalletPage', () => {
  let component: SelectCoinsWalletPage;
  let fixture: ComponentFixture<SelectCoinsWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectCoinsWalletPage>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletMaintenanceServiceSpy: jasmine.SpyObj<WalletMaintenanceService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  const testDynamicFormValue = {
    test1: {
      TNC: false,
      TC: false,
    },
    test2: {
      TNT: false,
    },
  };

  const testCoinValuesForDynamicForm: Array<Coin[]> = [
    [
      jasmine.createSpyObj('TestNativeCoin', {}, { value: 'TNC', network: 'test1', native: true }),
      jasmine.createSpyObj('TestNotNativeCoin', {}, { value: 'TC', network: 'test1' }),
    ],
    [jasmine.createSpyObj('TestNativeToken', {}, { value: 'TNT', network: 'test2', native: true })],
  ];

  const testSelectedTokens = [TEST_COINS[0], TEST_COINS[2], TEST_COINS[4], TEST_COINS[5], TEST_COINS[8], TEST_COINS[9]];

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

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [SelectCoinsWalletPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ReactiveFormsModule],
      providers: [
        TrackClickDirective,
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletMaintenanceService, useValue: walletMaintenanceServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
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

  it('should create form dynamically', async () => {
    apiWalletServiceSpy.getNetworks.and.returnValue(['test1', 'test2']);
    apiWalletServiceSpy.getCoinsFromNetwork.and.returnValues(...testCoinValuesForDynamicForm);
    await component.ionViewWillEnter();
    fixture.detectChanges();
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
    const assets: StorageAsset[] = [
      { value: 'ETH', network: 'ERC20' },
      { value: 'UNI', network: 'ERC20' },
      { value: 'MATIC', network: 'MATIC' },
      { value: 'SOL', network: 'SOLANA' },
    ];
    fixture.detectChanges();
    component.ionViewWillEnter();
    tick();
    component.form.patchValue(formData.valid);
    tick(150);
    expect(walletMaintenanceServiceSpy.updateTokensStorage).toHaveBeenCalledOnceWith(assets);
    flush();
  }));

  it('should autosave once when form updates multiple times', fakeAsync(() => {
    const assets: StorageAsset[] = [
      { value: 'ETH', network: 'ERC20' },
      { value: 'UNI', network: 'ERC20' },
      { value: 'MATIC', network: 'MATIC' },
      { value: 'SOL', network: 'SOLANA' },
    ];
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

  it('should change the toggle value when at least one element is not true', async () => {
    walletMaintenanceServiceSpy.getUserAssets.and.resolveTo(testSelectedTokens);
    await component.ionViewWillEnter();
    fixture.detectChanges();
    component.form.patchValue({ ERC20: { ETH: true } });
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.allSelected).toBeFalse();
  });

  it('should wipe fata from service on leave', () => {
    component.ionViewDidLeave();
    expect(walletMaintenanceServiceSpy.wipeDataFromService).toHaveBeenCalledTimes(1);
  });

  it('should track event when eventEmitted is false and a search is started', async () => {
    component.eventEmitted = false;
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-search-bar')).triggerEventHandler('search', { target: { value: 'a' } });
    fixture.detectChanges();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledWith({ eventLabel: 'ux_edit_tokens_search' });
  });

  it('should track event when no match in the search and show empty state', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-search-bar'))
      .triggerEventHandler('search', { target: { value: 'noCoins' } });
    fixture.detectChanges();
    const emptyStateEl = fixture.debugElement.query(By.css('div.sc__empty-state'));
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledWith({ eventLabel: 'ux_edit_tokens_search_empty' });
    expect(emptyStateEl).toBeTruthy();
  });

  it('should reload the coins when the input content is cleared', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-search-bar')).triggerEventHandler('search', { target: { value: '' } });
    fixture.detectChanges();
    expect(component.coins.length).toEqual(10);
    expect(component.disableSelectAll).toBeFalsy();
  });

  it('should filter the currencies when entering a text in the ion-searchbar', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-search-bar')).triggerEventHandler('search', { target: { value: 'eth' } });
    fixture.detectChanges();
    expect(component.coins.length).toEqual(1);
    expect(component.coins[0].value).toEqual('ETH');
  });
});
