import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { OperationsNewPage } from './operations-new.page';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';
import { DynamicKriptonPriceFactory } from '../shared-ramps/models/kripton-price/factory/dynamic-kripton-price-factory';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { DynamicKriptonPrice } from '../shared-ramps/models/kripton-price/dynamic-kripton-price';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

const availableKriptonCurrencies = [
  {
    network: 'MATIC',
    currencies: ['USDC', 'MATIC', 'DAI'],
  },
];

const links =
  "<a class='ux-link-xs' href='https://kriptonmarket.com/terms-and-conditions'>Terms and Conditions</a> and the <a class='ux-link-xs' href='https://cash.kriptonmarket.com/privacy'>Kripton Market Privacy Policy</a>.";

const validForm = {
  cryptoAmount: 10,
  fiatAmount: 10,
  thirdPartyKYC: true,
  thirdPartyTransaction: true,
  acceptTOSAndPrivacyPolicy: true,
};

const data = {
  email: 'test@test.com',
  auth_token: 'test',
  country: 'country',
  type: 'cash-in',
  amount_in: 105,
  amount_out: 100,
  currency_in: 'ARS',
  currency_out: 'USDT',
  price_in: '1',
  price_out: '100',
  wallet: '0x000000000000000000000dead',
  provider: '1',
  network: 'MATIC',
};

describe('OperationsNewPage', () => {
  let component: OperationsNewPage;
  let fixture: ComponentFixture<OperationsNewPage>;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<OperationsNewPage>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let dynamicKriptonPriceSpy: jasmine.SpyObj<DynamicKriptonPrice>;
  let kriptonDynamicPriceFactorySpy: jasmine.SpyObj<DynamicKriptonPriceFactory>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let priceSubject: Subject<number>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let kriptonStorageServiceSpy: jasmine.SpyObj<KriptonStorageService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(waitForAsync(() => {
    navControllerSpy = new FakeNavController().createSpy();
    storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', {
      updateData: null,
      getData: data,
    });

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getUserWallets: of({}),
      getOrCreateUser: of({}),
      setProvider: null,
      createOperation: of({ id: 335 }),
      getKriptonMinimumAmount: of({ minimum_general: 2913 }),
      getKriptonAvailableCurrencies: of(availableKriptonCurrencies),
      getKriptonFee: of({ data: { costs: '0.50', amount_in: '100', amount_out: '200' } }),
    });

    coinsSpy = [
      jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' }),
      jasmine.createSpyObj('Coin', {}, { value: 'DAI', network: 'MATIC' }),
    ];

    fakeActivatedRoute = new FakeActivatedRoute({}, { country: 'ARG' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });

    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x00000000000000' } }),
    });

    kriptonStorageServiceSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve('test@test.com'),
      set: Promise.resolve(),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: coinsSpy,
    });

    priceSubject = new Subject<number>();

    dynamicKriptonPriceSpy = jasmine.createSpyObj('DynamicKriptonPrice', {
      value: priceSubject,
    });

    kriptonDynamicPriceFactorySpy = jasmine.createSpyObj('KriptonDynamicPriceFactory', {
      new: dynamicKriptonPriceSpy,
    });

    providersSpy = jasmine.createSpyObj('Providers', {
      all: rawProvidersData,
      byAlias: rawProvidersData.find((provider) => provider.alias === 'kripton'),
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      {},
      {
        tokenOperationData: { asset: 'DAI', network: 'MATIC', country: 'ARG' },
      }
    );

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
    });

    fakeModalController = new FakeModalController({});
    modalControllerSpy = fakeModalController.createSpy();

    TestBed.configureTestingModule({
      declarations: [OperationsNewPage, FakeTrackClickDirective, FormattedAmountPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: StorageOperationService, useValue: storageOperationServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: DynamicKriptonPriceFactory, useValue: kriptonDynamicPriceFactorySpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsNewPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fakeActivatedRoute.modifySnapshotParams({}, { network: 'MATIC', asset: 'MATIC', country: 'ARG' });
    component.fiatPrice = 10;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set properly fiatAmount form value with minimum fiat amount', async () => {
    dynamicKriptonPriceSpy.value.and.returnValue(of(1));
    fiatRampsServiceSpy.getKriptonFee.and.returnValue(
      of({ data: { costs: '0.50', amount_in: '2913', amount_out: '100' } })
    );
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(component.form.controls.fiatAmount.value).toEqual(2913);
  });

  it('should set country, default currency, provider and price on init', async () => {
    await component.ionViewWillEnter();
    priceSubject.next(10);
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(fiatRampsServiceSpy.setProvider).toHaveBeenCalledOnceWith('1');
    expect(component.providerTokens).toEqual(coinsSpy);
    expect(component.country).toEqual({
      name: 'Argentina',
      value: 'fiat_ramps.countries_list.argentina',
      fiatCode: 'ars',
      isoCodeAlpha3: 'ARG',
      iso4217CurrencyCode: 'ARS',
      directaCode: 'AR',
      isoCurrencyCodeDirecta: 'ARS',
      flagRoute: 'assets/img/countries/argentina.svg',
    });
    expect(component.selectedCurrency).toEqual(coinsSpy[1]);
    expect(component.fiatCurrency).toEqual('ars');
    expect(component.fiatPrice).toEqual(10);
    expect(fiatRampsServiceSpy.getKriptonMinimumAmount).toHaveBeenCalledOnceWith({
      currency_in: 'ars',
      operation_type: 'cash-in',
      currency_out: coinsSpy[1].value,
      email: 'test@test.com',
      network_out: coinsSpy[1].network,
    });
  });

  it('should open external link when http link is clicked', () => {
    const labelWithExternalLink = fixture.debugElement.query(
      By.css('ion-item.anko__content__checkbox__item > ion-label')
    );
    labelWithExternalLink.nativeElement.innerHTML = links;
    fixture.detectChanges();
    component.ngAfterViewInit();
    const anchor = fixture.debugElement.query(By.css('a'));
    anchor.nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'https://kriptonmarket.com/terms-and-conditions' });
  });

  it('should create and save operation and redirect to purchase order when valid form is submitted', async () => {
    kriptonStorageServiceSpy.get.withArgs('email').and.resolveTo('test@test.com');
    kriptonStorageServiceSpy.get.withArgs('access_token').and.resolveTo('test');
    await component.ionViewWillEnter();
    component.form.patchValue(validForm);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    await component.handleSubmit();
    expect(fiatRampsServiceSpy.createOperation).toHaveBeenCalledWith(data);
    expect(storageOperationServiceSpy.updateData).toHaveBeenCalledTimes(2);
    expect(kriptonStorageServiceSpy.set).toHaveBeenCalledWith('privacy_and_policy_accepted', true);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/fiat-ramps/purchase-order/1');
  });

  it('should call trackEvent on trackService when ux_buy_kripton_continue Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_buy_kripton_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show form validation errors when form submitted is not valid', async () => {
    const spy = spyOn(component.form, 'markAsTouched').and.callThrough();
    await component.ionViewWillEnter();
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should update fiat fee when price changes', fakeAsync(() => {
    component.minimumFiatAmount = 2913;
    component.fiatPrice = 10;
    component.ionViewWillEnter();
    tick();
    component.form.patchValue({ cryptoAmount: 1 });
    tick();
    fixture.detectChanges();

    expect(component.fiatFee.value).toEqual(5);

    priceSubject.next(35);
    tick();
    fixture.detectChanges();

    expect(component.fiatFee.value).toEqual(17.5);
  }));

  it('should unsubscribe when leave', async () => {
    await component.ionViewWillEnter();
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should validate that the fiat amount equals the minimum value in fiat currency', async () => {
    dynamicKriptonPriceSpy.value.and.returnValue(of(1));
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    component.form.patchValue({ fiatAmount: 1 });
    fixture.detectChanges();
    expect(component.form.controls.fiatAmount.valid).toBeFalse();
    component.form.patchValue({ fiatAmount: 2914 });
    fixture.detectChanges();
    expect(component.form.controls.fiatAmount.valid).toBeTrue();
  });

  it('should show specific copies when user has a simplied wallet', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-text.anko__content__text-header__title'));
    const descriptionEl = fixture.debugElement.query(By.css('ion-text.anko__content__text-header__description'));

    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.new_operation.title');
    expect(descriptionEl.nativeElement.innerHTML).toContain('fiat_ramps.new_operation.description');
  });

  it('should subtitle copy when user hasnt a simplied wallet', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(false);
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-text.anko__content__text-header__title'));
    const descriptionEl = fixture.debugElement.query(By.css('ion-text.anko__content__text-header__description'));

    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.new_operation.title');
    expect(descriptionEl).toBeFalsy();
  });
});
