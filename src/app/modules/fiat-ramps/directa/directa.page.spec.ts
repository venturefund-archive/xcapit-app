import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { DirectaPage } from './directa.page';
import { rawProviderCountriesData } from '../shared-ramps/fixtures/raw-provider-countries-data';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { WalletMaintenanceService } from '../../wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { LanguageService } from '../../../shared/services/language/language.service';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { PlatformService } from '../../../shared/services/platform/platform.service';
import DepositLinkRequestFactory from '../shared-ramps/models/deposit-link-request/factory/deposit-link-request.factory';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { RouterTestingModule } from '@angular/router/testing';
import DepositLinkRequest from '../shared-ramps/models/deposit-link-request/deposit-link-request';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { DynamicDirectaPrice } from '../shared-ramps/models/directa-price/dynamic-directa-price';
import { DynamicDirectaPriceFactory } from '../shared-ramps/models/directa-price/factory/dynamic-directa-price-factory';
import { FakeProviders } from '../shared-ramps/models/providers/fake/fake-providers';

describe('DirectaPage', () => {
  let component: DirectaPage;
  let fixture: ComponentFixture<DirectaPage>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let fakeActivatedRoute: FakeActivatedRoute;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let walletMaintenanceServiceSpy: jasmine.SpyObj<WalletMaintenanceService>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let dynamicDirectaPriceFactorySpy: jasmine.SpyObj<DynamicDirectaPriceFactory>;
  let directaPriceSpy: jasmine.SpyObj<DynamicDirectaPrice>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let directaLinkRequestFactorySpy: jasmine.SpyObj<DepositLinkRequestFactory>;
  let directaLinkRequestSpy: jasmine.SpyObj<DepositLinkRequest>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let envServiceSpy: jasmine.SpyObj<EnvService>;
  let priceSubject: Subject<number>;
  let fakeProviders: FakeProviders;

  const availableKriptonCurrencies = [
    {
      network: 'MATIC',
      currencies: ['USDC', 'MATIC', 'DAI'],
    },
  ];

  beforeEach(waitForAsync(() => {
    coinsSpy = [
      jasmine.createSpyObj('Coin', {}, { value: 'USDC', network: 'MATIC' }),
      jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' }),
    ];
    fakeActivatedRoute = new FakeActivatedRoute({ country: 'argentina' }, {});
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: coinsSpy,
    });

    fakeProviders = new FakeProviders(
      rawProvidersData,
      rawProvidersData.find((provider) => provider.alias === 'PX'),
      null,
      of([
        {
          code: 'PX',
          paymentType: 'VOUCHER',
        },
      ])
    );

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getDirectaExchangeRate: of({ fee: 1 }),
      getKriptonAvailableCurrencies: of(availableKriptonCurrencies),
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: fakeProviders,
    });

    walletMaintenanceServiceSpy = jasmine.createSpyObj('WalletMaintenanceService', {
      addCoinIfUserDoesNotHaveIt: Promise.resolve(),
    });
    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      {
        clean: Promise.resolve(),
      },
      {
        tokenOperationData: { asset: 'USDC', network: 'MATIC', country: 'ECU' },
      }
    );

    priceSubject = new BehaviorSubject<number>(4);

    directaPriceSpy = jasmine.createSpyObj('DirectaPrice', {
      value: priceSubject,
    });

    dynamicDirectaPriceFactorySpy = jasmine.createSpyObj('DynamicDirectaPriceFactory', {
      new: directaPriceSpy,
    });

    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: true,
    });

    languageServiceSpy = jasmine.createSpyObj('LanguageService', {
      getSelectedLanguage: Promise.resolve('en'),
    });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve('0x_some_test_wallet'),
    });

    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });

    directaLinkRequestSpy = jasmine.createSpyObj('DirectaLinkRequest', {
      response: of({ link: 'test-link/hash' }),
    });

    directaLinkRequestFactorySpy = jasmine.createSpyObj('DirectaLinkRequestFactory', {
      new: directaLinkRequestSpy,
    });

    envServiceSpy = jasmine.createSpyObj('EnvService', {
      byKey: 'api_url',
      all: {
        firebase: {
          dynamicLinkUrl: 'https://testlink.com',
        },
      },
    });

    TestBed.configureTestingModule({
      declarations: [DirectaPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: WalletMaintenanceService, useValue: walletMaintenanceServiceSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        { provide: DynamicDirectaPriceFactory, useValue: dynamicDirectaPriceFactorySpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: DepositLinkRequestFactory, useValue: directaLinkRequestFactorySpy },
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: EnvService, useValue: envServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectaPage);
    component = fixture.componentInstance;
    component.countries = rawProviderCountriesData;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add coin if user doesnt have it in wallet when Continue is clicked', async () => {
    await component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-button[name="Continue"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(walletMaintenanceServiceSpy.addCoinIfUserDoesNotHaveIt).toHaveBeenCalledTimes(1);
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'test-link/hash' });
  });

  it('should set country, default currency, provider, and paymentType on init', fakeAsync(() => {
    fakeActivatedRoute.modifySnapshotParams({ alias: 'PX' });
    component.form.patchValue({ fiatAmount: 1 });
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    expect(component.country.name).toEqual('Ecuador');
    expect(component.selectedCurrency).toEqual(coinsSpy[0]);
    expect(component.fiatCurrency).toEqual('USD');
    expect(component.paymentType).toEqual('fiat_ramps.shared.constants.payment_types.directa24_voucher');
  }));

  it('should unsubscribe when leave', async () => {
    await component.ionViewWillEnter();
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should recalculate fiat amount when crypto amount is changed', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    component.form.patchValue({ cryptoAmount: 3 });
    fixture.detectChanges();
    tick();
    expect(component.form.value.fiatAmount).toEqual(12);
    expect(component.fee.value).toEqual(4);
  }));

  it('should recalculate crypto amount when fiat amount is changed', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    component.form.patchValue({ fiatAmount: 9.1234 });
    fixture.detectChanges();
    tick();
    expect(component.form.value.fiatAmount).toEqual(9.12);
    expect(component.form.value.cryptoAmount).toEqual(2.28);
    expect(component.fee.value).toEqual(4);
  }));

  it('should validate that the crypto amount equals the minimum value in dollars', async () => {
    directaPriceSpy.value.and.returnValue(of(1));
    await component.ionViewWillEnter();
    component.form.patchValue({ fiatAmount: 1 });
    fixture.detectChanges();
    expect(component.form.controls.fiatAmount.valid).toBeFalse();
    component.form.patchValue({ fiatAmount: 10 });
    expect(component.form.controls.fiatAmount.valid).toBeTrue();
  });

  it('should reset info when input changes', async () => {
    await component.ionViewWillEnter();
    component.form.patchValue({ fiatAmount: null });
    fixture.detectChanges();
    expect(component.fee.value).toEqual(0);
    expect(component.form.value.cryptoAmount).toEqual(0);

    component.form.patchValue({ cryptoAmount: null });
    fixture.detectChanges();
    expect(component.form.value.fiatAmount).toEqual(0);
  });

  it('should update inputs when price is set', async () => {
    await component.ionViewWillEnter();
    component.form.patchValue({ cryptoAmount: 1 });
    priceSubject.next(1);
    fixture.detectChanges();
    expect(component.form.value.fiatAmount).toEqual(1);
    expect(component.form.value.cryptoAmount).toEqual(1);
    component.ionViewWillLeave();
  });
});
