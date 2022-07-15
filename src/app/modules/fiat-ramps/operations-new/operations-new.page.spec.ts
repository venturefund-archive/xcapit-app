import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { OperationsNewPage } from './operations-new.page';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';
import { KriptonDynamicPriceFactory } from '../shared-ramps/models/kripton-dynamic-price/factory/kripton-dynamic-price-factory';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

const links =
  "<a class='ux-link-xs' href='https://kriptonmarket.com/terms-and-conditions'>Terms and Conditions</a> and the <a class='ux-link-xs' href='https://kriptonmarket.com/privacy'>Kripton Market Privacy Policy</a>.";

const validForm = {
  cryptoAmount: 10,
  fiatAmount: 10,
  thirdPartyKYC: true,
  thirdPartyTransaction: true,
  acceptTOSAndPrivacyPolicy: true,
};

const cleanForm = {
  country: jasmine.any(String),
  type: jasmine.any(String),
  pair: '',
  amount_in: '',
  price_out: '',
  currency_in: '',
  currency_out: '',
  wallet: '',
  network: '',
  amount_out: null,
  price_in: null,
  provider: null,
};

const userNew = {
  id: 100,
  registration_status: 'USER_INFORMATION',
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
  let kriptonDynamicPriceFactorySpy: jasmine.SpyObj<KriptonDynamicPriceFactory>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = new FakeNavController().createSpy();
      storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', {
        updateData: null,
      });
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        getUserWallets: of({}),
        checkUser: of({}),
        createUser: of({}),
        setProvider: null,
      });

      coinsSpy = [
        jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' }),
        jasmine.createSpyObj('Coin', {}, { value: 'DAI', network: 'MATIC' }),
      ];

      fakeActivatedRoute = new FakeActivatedRoute({}, { country: 'ARS' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();

      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });

      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x00000000000000' } }),
      });

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoins: coinsSpy,
      });

      kriptonDynamicPriceFactorySpy = jasmine.createSpyObj('KriptonDynamicPriceFactorySpy', {
        new: { value: () => of(10) },
      });

      providersSpy = jasmine.createSpyObj('Providers', {
        all: rawProvidersData,
        byAlias: rawProvidersData.find((provider) => provider.alias === 'kripton'),
      });

      providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
        create: providersSpy,
      });

      TestBed.configureTestingModule({
        declarations: [OperationsNewPage, FakeTrackClickDirective],
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
          { provide: KriptonDynamicPriceFactory, useValue: kriptonDynamicPriceFactorySpy },
          { provide: ProvidersFactory, useValue: providersFactorySpy },
          { provide: RemoteConfigService, useValue: remoteConfigSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsNewPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set country, default currency, provider and price on init', () => {
    component.ionViewWillEnter();
    expect(fiatRampsServiceSpy.setProvider).toHaveBeenCalledOnceWith('1');
    expect(component.providerTokens).toEqual(coinsSpy);
    expect(component.country).toEqual({
      name: 'Argentina',
      value: 'fiat_ramps.countries_list.argentina',
      fiatCode: 'ars',
      isoCodeAlpha3: 'ARS',
      directaCode: 'AR',
    });
    expect(component.selectedCurrency).toEqual(coinsSpy[0]);
    expect(component.fiatCurrency).toEqual('ars');
    expect(component.price).toEqual(10);
  });

  it('should set currency passed by params on init', () => {
    fakeActivatedRoute.modifySnapshotParams({}, { network: 'MATIC', asset: 'DAI', country: 'ARS' });
    component.ionViewWillEnter();
    expect(component.selectedCurrency).toEqual(coinsSpy[1]);
  });

  it('should set USD as fiat currency when country has not specific local currency on init', () => {
    fakeActivatedRoute.modifySnapshotParams({}, { country: 'GTM' });
    component.ionViewWillEnter();
    expect(component.fiatCurrency).toEqual('USD');
  });

  it('should open external link when http link is clicked', () => {
    const labelWithExternalLink = fixture.debugElement.query(By.css('ion-item.aon__disclaimer__item > ion-label'));
    labelWithExternalLink.nativeElement.innerHTML = links;
    fixture.detectChanges();
    component.ngAfterViewInit();
    const anchor = fixture.debugElement.query(By.css('a'));
    anchor.nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'https://kriptonmarket.com/terms-and-conditions' });
  });

  it('should save operation and create user when valid form is submitted and user doesnt exists', async () => {
    component.ionViewWillEnter();
    component.form.patchValue(validForm);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    await component.handleSubmit();
    expect(storageOperationServiceSpy.updateData).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.checkUser).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.createUser).toHaveBeenCalledTimes(1);
  });

  it('should redirect user when valid form is submitted and user already exists', async () => {
    fiatRampsServiceSpy.checkUser.and.returnValue(of(userNew));
    component.ionViewWillEnter();
    component.form.patchValue(validForm);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    await component.handleSubmit();
    expect(fiatRampsServiceSpy.checkUser).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/user-information']);
  });

  it('should redirect to user information form when status is USER_INFORMATION', () => {
    const url = component.getUrlByStatus('USER_INFORMATION');
    expect(url).toEqual(['fiat-ramps/user-information']);
  });

  it('should redirect to user bank information form when status is USER_BANK', () => {
    const url = component.getUrlByStatus('USER_BANK');
    expect(url).toEqual(['fiat-ramps/user-bank']);
  });

  it('should redirect to user images upload form when status is USER_IMAGES', () => {
    const url = component.getUrlByStatus('USER_IMAGES');
    expect(url).toEqual(['fiat-ramps/user-images']);
  });

  it('should redirect to new order confirm when status is COMPLETE', () => {
    const url = component.getUrlByStatus('COMPLETE');
    expect(url).toEqual(['fiat-ramps/confirm-page']);
  });

  it('should call trackEvent on trackService when ux_buy_kripton_continue Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_buy_kripton_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show form validation errors when form submitted is not valid', () => {
    const spy = spyOn(component.form, 'markAsTouched').and.callThrough();
    component.ionViewWillEnter();
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should redirect to change currency when currency button is clicked on provider card', async () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        country: 'ARS',
      },
    };
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-provider-new-operation-card')).triggerEventHandler('changeCurrency', null);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      ['/fiat-ramps/token-selection', 'kripton'],
      navigationExtras
    );
  });
});
