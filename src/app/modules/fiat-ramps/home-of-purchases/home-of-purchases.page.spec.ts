import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { HomeOfPurchasesPage } from './home-of-purchases.page';

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

const user_status = { kyc_approved: false, registration_status: 'USER_INFORMATION' };

describe('HomeOfPurchasesPage', () => {
  let component: HomeOfPurchasesPage;
  let fixture: ComponentFixture<HomeOfPurchasesPage>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let kriptonStorageSpy: jasmine.SpyObj<KriptonStorageService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsServiceSpy', {
      getUserOperations: of(rawOperations),
      getOrCreateUser: of(user_status),
    });

    providersSpy = jasmine.createSpyObj('Providers', {
      all: rawProvidersData,
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    tokenOperationDataServiceSpy = jasmine.createSpyObj('TokenOperationDataService', {
      tokenOperationData: { asset: 'USDC', network: 'MATIC', country: 'ECU' },
    });

    kriptonStorageSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve('test@test.com'),
    });

    TestBed.configureTestingModule({
      declarations: [HomeOfPurchasesPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeOfPurchasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should navigate to select provider page when ux_buy_kripton_new is clicked and there is asset', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css("ion-button[name='ux_buy_kripton_new']")).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('fiat-ramps/select-provider');
  });

  it('should navigate to select token page when ux_buy_kripton_new is clicked and there isnt asset', () => {
    tokenOperationDataServiceSpy.tokenOperationData = undefined;
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css("ion-button[name='ux_buy_kripton_new']")).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('fiat-ramps/token-selection');
  });

  it('should navigate to faqs when support link is clicked', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.hop__question > ion-text')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/support/faqs/buy');
  });

  it('should get user status of kripton market on init', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(fiatRampsServiceSpy.getOrCreateUser).toHaveBeenCalledOnceWith({ email: 'test@test.com' });
    expect(component.userStatus).toEqual(user_status);
  });

  it('should set correctly data when user status is USER_INFORMATION', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.title).toEqual('fiat_ramps.kyc_status.title');
    expect(component.message).toEqual('fiat_ramps.kyc_status.starting.message');
    expect(component.status).toEqual('fiat_ramps.kyc_status.starting.status');
    expect(component.style).toEqual('warning');
  });

  it('should set correctly data when user status is USER_IMAGES', async () => {
    fiatRampsServiceSpy.getOrCreateUser.and.returnValue(of({ registration_status: 'USER_IMAGES' }));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.title).toEqual('fiat_ramps.kyc_status.title');
    expect(component.message).toEqual('fiat_ramps.kyc_status.starting.message');
    expect(component.status).toEqual('fiat_ramps.kyc_status.pending.status');
    expect(component.style).toEqual('warning');
  });

  it('should set correctly data when user status is COMPLETE', async () => {
    fiatRampsServiceSpy.getOrCreateUser.and.returnValue(of({ registration_status: 'COMPLETE' }));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.title).toEqual('fiat_ramps.kyc_status.title');
    expect(component.message).toEqual('fiat_ramps.kyc_status.checking.message');
    expect(component.status).toEqual('fiat_ramps.kyc_status.checking.status');
    expect(component.style).toEqual('warning');
  });

  it('should set correctly data when KYC is approved', async () => {
    fiatRampsServiceSpy.getOrCreateUser.and.returnValue(of({ kyc_approved: true }));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.title).toEqual('fiat_ramps.kyc_status.approving.title');
    expect(component.message).toEqual('fiat_ramps.kyc_status.approving.message');
    expect(component.style).toEqual('approving');
  });
});
