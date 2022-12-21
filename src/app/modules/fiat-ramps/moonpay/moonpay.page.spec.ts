import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { BehaviorSubject, of, Subject } from 'rxjs';
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
import { WalletMaintenanceService } from '../../wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { WalletsFactory } from '../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeWallet } from '../../swaps/shared-swaps/models/wallet/wallet';
import { DynamicMoonpayPrice } from '../shared-ramps/models/moonpay-price/dynamic-moonpay-price';
import { DynamicMoonpayPriceFactory } from '../shared-ramps/models/moonpay-price/factory/dynamic-moonpay-price-factory';

describe('MoonpayPage', () => {
  let component: MoonpayPage;
  let fixture: ComponentFixture<MoonpayPage>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<MoonpayPage>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletMaintenanceServiceSpy: jasmine.SpyObj<WalletMaintenanceService>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let walletsFactorySpy: jasmine.SpyObj<any | WalletsFactory>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let dynamicMoonpayPriceFactorySpy: jasmine.SpyObj<DynamicMoonpayPriceFactory>;
  let moonpayPriceSpy: jasmine.SpyObj<DynamicMoonpayPrice>;
  let priceSubject: Subject<number>;

  const testWallet = {
    assets: {
      ETH: true,
      LINK: false,
      UNI: true,
      MATIC: true,
    },
    addresses: {
      ERC20: 'testERC20Address',
      MATIC: 'testMaticAddress',
    },
  };

  const moonpayBuyQuote = {
    baseCurrencyCode: 'usd',
    quoteCurrencyCode: 'btc',
    baseCurrencyAmount: 50,
    totalAmount: 55,
  };

  const blockchain = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)).oneByName('ERC20');

  const testLimitData = {
    quoteCurrency: {
      code: 'eth',
      minBuyAmount: 0.0166,
    },
  };

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    fakeActivatedRoute = new FakeActivatedRoute({}, { country: 'COL' });

    browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsServiceSpy', {
      getMoonpayRedirectLink: of({ url: 'http://testURL.com' }),
      getMoonpayQuotation: of({ ARG: 1 }),
      getMoonpayBuyQuote: of(moonpayBuyQuote),
      getMoonpayLimitOfBuyQuote: of(testLimitData),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: TEST_COINS,
    });

    walletMaintenanceServiceSpy = jasmine.createSpyObj(
      'WalletMaintenanceService',
      {
        getEncryptedWalletFromStorage: Promise.resolve(),
        addCoinIfUserDoesNotHaveIt: Promise.resolve(),
        wipeDataFromService: null,
      },
      {
        encryptedWallet: testWallet,
      }
    );

    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      {},
      {
        tokenOperationData: { asset: 'ETH', network: 'ERC20', country: 'ARS' },
      }
    );

    providersSpy = jasmine.createSpyObj('Providers', {
      byAlias: rawProvidersData.find((provider) => provider.alias === 'moonpay'),
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: {
        oneByName: () => {
          return blockchain;
        },
      },
    });

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(new FakeWallet()) },
    });

    fakeModalController = new FakeModalController({});
    modalControllerSpy = fakeModalController.createSpy();

    priceSubject = new BehaviorSubject<number>(4);

    moonpayPriceSpy = jasmine.createSpyObj('MoonpayPrice', {
      value: priceSubject,
    });

    dynamicMoonpayPriceFactorySpy = jasmine.createSpyObj('DynamicMoonpayPriceFactory', {
      new: moonpayPriceSpy,
    });

    TestBed.configureTestingModule({
      declarations: [MoonpayPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletMaintenanceService, useValue: walletMaintenanceServiceSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: DynamicMoonpayPriceFactory, useValue: dynamicMoonpayPriceFactorySpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MoonpayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open in app browser and redirect to tabs wallets when ux_buy_moonpay_continue is clicked', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_buy_moonpay_continue"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(blockchainsFactorySpy.create).toHaveBeenCalledTimes(1);
    expect(walletsFactorySpy.create).toHaveBeenCalledTimes(1);
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'http://testURL.com' });
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/wallets']);
  });

  it('should call addCoinIfUserDoesNotHaveIt when transaction completes', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_buy_moonpay_continue"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(walletMaintenanceServiceSpy.addCoinIfUserDoesNotHaveIt).toHaveBeenCalledOnceWith(TEST_COINS[0]);
  });

  it('should call wipeDataFromService on ionViewDidLeave', () => {
    component.ionViewDidLeave();
    expect(walletMaintenanceServiceSpy.wipeDataFromService).toHaveBeenCalledTimes(1);
  });

  it('should select the currency specified by parameter on init', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.selectedCurrency.value).toEqual(tokenOperationDataServiceSpy.tokenOperationData.asset);
  });

  it('should show modal', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-provider-new-operation-card'))
      .triggerEventHandler('changeCurrency', undefined);
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe when leave', () => {
    component.ionViewWillEnter();
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
    expect(component.form.value.fiatAmount).toEqual(12);
    expect(component.fee.value).toEqual(5);
  }));

  it('should recalculate crypto amount when fiat amount is changed', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    component.form.patchValue({ fiatAmount: 9.1234 });
    expect(component.form.value.cryptoAmount).toEqual(2.28);
    expect(component.fee.value).toEqual(5);
  }));

  it('should get data of currency limits and calculate minimum fiat amount', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    expect(fiatRampsServiceSpy.getMoonpayLimitOfBuyQuote).toHaveBeenCalledWith(
      tokenOperationDataServiceSpy.tokenOperationData.asset.toLowerCase(),
      'usd'
    );
    expect(component.minimumFiatAmount).toEqual(0.0664);
  }));

  it('should validate minimum amount', () => {
    component.ionViewWillEnter();
    component.form.patchValue({ fiatAmount: 0.000001 });
    fixture.detectChanges();
    expect(component.form.controls.fiatAmount.valid).toBeFalse();
    component.form.patchValue({ fiatAmount: 30 });
    fixture.detectChanges();
    expect(component.form.controls.fiatAmount.valid).toBeTrue();
  });
});
