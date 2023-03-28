import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { KriptonUserInjectable } from '../shared-ramps/models/kripton-user/injectable/kripton-user.injectable';
import { KriptonUser } from '../shared-ramps/models/kripton-user/kripton-user';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { HomeOfPurchasesPage } from './home-of-purchases.page';
import { rawOperationData } from '../shared-ramps/fixtures/raw-operation-data';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';

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
  let kriptonUserSpy: jasmine.SpyObj<KriptonUser>;
  let kriptonUserInjectableSpy: jasmine.SpyObj<KriptonUserInjectable>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomeOfPurchasesPage>;

  const user_status = { kyc_approved: false, registration_status: 'USER_INFORMATION' };

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsServiceSpy', {
      getUserOperations: of(rawOperationData),
      getOrCreateUser: of(user_status),
    });

    providersSpy = jasmine.createSpyObj('Providers', {
      all: rawProvidersData,
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      {
        clean: {},
        add: {},
        hasAssetInfo: false,
        set: null
      },
      {
        tokenOperationData: { isFirstTime: false },
      }
    );

    kriptonStorageSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve(),
    });
    kriptonStorageSpy.get.withArgs('email').and.resolveTo('test@test.com');
    kriptonStorageSpy.get.withArgs('access_token').and.resolveTo('test');
    kriptonStorageSpy.get.withArgs('kyc_approved').and.resolveTo();
    kriptonUserSpy = jasmine.createSpyObj('KriptonUser', {
      isLogged: Promise.resolve(true),
    });

    kriptonUserInjectableSpy = jasmine.createSpyObj('KriptonUserInjectable', {
      create: kriptonUserSpy,
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', { trackEvent: Promise.resolve(true) });

    TestBed.configureTestingModule({
      declarations: [HomeOfPurchasesPage, FakeTrackClickDirective, FakeFeatureFlagDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageSpy },
        { provide: KriptonUserInjectable, useValue: kriptonUserInjectableSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeOfPurchasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show operations when kripton is enabled', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();
    expect(fiatRampsServiceSpy.getUserOperations).toHaveBeenCalledOnceWith({
      email: 'test@test.com',
      auth_token: 'test',
    });
  }));

  it('should not show kripton operations when kripton is disabled', async () => {
    providersSpy.all.and.returnValue(rawProvidersData.filter((provider) => provider.alias !== 'kripton'));
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fiatRampsServiceSpy.getUserOperations).toHaveBeenCalledTimes(0);
  });

  it('should not show kripton operations when user is not logged on kripton', async () => {
    kriptonUserSpy.isLogged.and.resolveTo(false);
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fiatRampsServiceSpy.getUserOperations).toHaveBeenCalledTimes(0);
  });

  it('should navigate to token selection page when ux_buy_new is clicked and there is not asset info', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css("ion-button[name='ux_buy_new']")).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/token-selection');
    expect(tokenOperationDataServiceSpy.add).toHaveBeenCalledOnceWith({ mode: 'buy' });
  });

  it('should navigate to select provider page when ux_buy_new is clicked, there is asset info and is first time', () => {
    tokenOperationDataServiceSpy.tokenOperationData.isFirstTime = true;
    tokenOperationDataServiceSpy.hasAssetInfo.and.returnValue(true);
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css("ion-button[name='ux_buy_new']")).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/select-provider');
    expect(tokenOperationDataServiceSpy.add).toHaveBeenCalledTimes(2);
  });

  it('should navigate to token selection page when ux_buy_new is clicked, there is asset info and is not first time', () => {
    tokenOperationDataServiceSpy.tokenOperationData.isFirstTime = false;
    tokenOperationDataServiceSpy.hasAssetInfo.and.returnValue(true);
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css("ion-button[name='ux_buy_new']")).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/token-selection');
    expect(tokenOperationDataServiceSpy.add).toHaveBeenCalledOnceWith({mode: 'buy'});
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

  it('should set disabledStatusCard on false if not exist kripton_kyc_approved key on storage on did enter', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    expect(kriptonStorageSpy.get).toHaveBeenCalledTimes(1);
    expect(component.disabledStatusCard).toBeFalsy();
  });

  it('should render kripton kyc status and operation list only when kripton is enabled', async () => {
    const providersWithoutKripton = rawProvidersData.filter((provider) => provider.alias !== 'kripton');
    providersSpy.all.and.returnValue(providersWithoutKripton);
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const kriptonKycStatusEl = fixture.debugElement.query(By.css('div.kyc-status-card'));
    const kriptonOperationList = fixture.debugElement.query(By.css('div.hop__operations-list'));
    expect(kriptonKycStatusEl).toBeFalsy();
    expect(kriptonOperationList).toBeFalsy();
  });

  it('should render moonpay card only when moonpay is enabled', async () => {
    const providersWithoutMoonpay = rawProvidersData.filter((provider) => provider.alias !== 'moonpay');
    providersSpy.all.and.returnValue(providersWithoutMoonpay);
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const moonpayCardEl = fixture.debugElement.query(By.css('div.hop__moonpay-purchases'));
    expect(moonpayCardEl).toBeFalsy();
  });

  it('should back to /tabs/wallets on back', () => {
    fixture.debugElement.query(By.css('ion-back-button')).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/tabs/wallets')
  });
  
  it('should clean user info if user logout from kripton', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-operations-list')).triggerEventHandler('loggedOut', {});
    fixture.detectChanges();
    expect(component.userStatus).toBeNull();
  })

  it('should call trackEvent when ux_buy_new button is clicked', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_buy_new');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent when ux_sell_new button is clicked', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_sell_new');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
