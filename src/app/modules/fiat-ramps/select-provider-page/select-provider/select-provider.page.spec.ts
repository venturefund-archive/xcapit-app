import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { SpyProperty } from 'src/testing/spy-property.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { rawProvidersData } from '../../shared-ramps/fixtures/raw-providers-data';
import { ProvidersFactory } from '../../shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../../shared-ramps/models/providers/providers.interface';
import { FiatRampsService } from '../../shared-ramps/services/fiat-ramps.service';
import { TokenOperationDataService } from '../../shared-ramps/services/token-operation-data/token-operation-data.service';
import { SelectProviderPage } from './select-provider.page';

const rawOperations: any[] = [
  {
    operation_id: '355',
    operation_type: 'cash-in',
    status: 'pending_by_validate',
    currency_in: 'ARS',
    amount_in: 200.0,
    currency_out: 'USDC',
    amount_out: 1.33288904,
    created_at: '2022-03-22T14:58:44.303Z',
    provider: '1',
    voucher: false,
  },
  {
    operation_id: '364',
    operation_type: 'cash-in',
    status: 'pending_by_validate',
    currency_in: 'ars',
    amount_in: 145.68149073,
    currency_out: 'MATIC',
    amount_out: 1.38660038,
    created_at: '2022-05-13T17:30:23.258Z',
    provider: '1',
    voucher: false,
  },
];
const coin = {
  id: 8,
  name: 'MATIC - Polygon',
  logoRoute: 'assets/img/coins/MATIC.png',
  value: 'MATIC',
  network: 'MATIC',
  native: true,
  symbol: 'MATICUSDT',
};
const testForm = {
  valid: {
    provider: 'testProvider',
    country: {
      isoCodeAlpha3: 'ARS',
    },
  },
};

describe('SelectProviderPage', () => {
  let component: SelectProviderPage;
  let fixture: ComponentFixture<SelectProviderPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectProviderPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
        trackEvent: Promise.resolve(true),
      });
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoin: coin,
      });
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsServiceSpy', {
        getUserOperations: of(rawOperations),
      });
      tokenOperationDataServiceSpy = jasmine.createSpyObj('TokenOperationDataService',{},{
        tokenOperationData: {}
      })
      providersSpy = jasmine.createSpyObj('Providers', {
        all: rawProvidersData,
      });

      providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
        create: providersSpy,
      });
      TestBed.configureTestingModule({
        declarations: [SelectProviderPage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
          { provide: ProvidersFactory, useValue: providersFactorySpy },
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectProviderPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when ux_vendor_buy_continue is clicked', () => {
    component.form.patchValue(testForm.valid);
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_vendor_buy_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to provider url when ux_vendor_buy_continue is clicked', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    component.form.patchValue(testForm.valid);
    fixture.debugElement.query(By.css('app-select-provider-card')).triggerEventHandler('route', 'test');
    fixture.debugElement.query(By.css("ion-button[name='ux_vendor_buy_continue']")).nativeElement.click();
    expect(tokenOperationDataServiceSpy.tokenOperationData).not.toBeNull();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['test']);
  });

  it('should reset form when country is changed', () => {
    const spy = spyOn(component.form.get('provider'), 'reset');
    fixture.debugElement.query(By.css('app-select-provider-card')).triggerEventHandler('changedCountry', 'Argentina');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.form.get('provider').value).toEqual('');
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should show operations when kripton is enabled', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fiatRampsServiceSpy.getUserOperations).toHaveBeenCalledTimes(1);
  });

  it('should not show kripton operations when kripton is disabled', async () => {
    providersSpy.all.and.returnValue(rawProvidersData.filter((provider) => provider.alias !== 'kripton'));
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fiatRampsServiceSpy.getUserOperations).toHaveBeenCalledTimes(0);
  });

  it('should country be undefined if tokenOperationData has not country data',  () => {
    component.ionViewDidEnter();

    expect(component.form.get('country').value).toEqual('');
  });

  it('should country be setted if tokenOperationData has country data', () => {
    new SpyProperty(tokenOperationDataServiceSpy, 'tokenOperationData').value().and.returnValue({asset: 'MATIC', network: 'MATIC', country: 'MEX'});
    fixture.detectChanges()
    component.ionViewDidEnter();

    expect(component.form.get('country').value.isoCodeAlpha3).toEqual('MEX');
  });
});
