import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserKycKriptonImagesService } from '../shared-ramps/services/user-kyc-kripton-images/user-kyc-kripton-images.service';
import { KycConfirmationPage } from './kyc-confirmation.page';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { of } from 'rxjs';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

describe('KycConfirmationPage', () => {
  let component: KycConfirmationPage;
  let fixture: ComponentFixture<KycConfirmationPage>;
  let userKycKriptonImagesServiceSpy: jasmine.SpyObj<UserKycKriptonImagesService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let kriptonStorageSpy: jasmine.SpyObj<KriptonStorageService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController(null, { role: 'confirm' });
    modalControllerSpy = fakeModalController.createSpy();

    fakeActivatedRoute = new FakeActivatedRoute({ digitalDocument: 'front_id' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    userKycKriptonImagesServiceSpy = jasmine.createSpyObj('UserKycKriptonImagesService', {
      getPhotos: { front_document: 'http://localhost:9876/assets/test_image.svg' },
    });

    kriptonStorageSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve('test@test.com'),
      set: null,
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    navControllerSpy = new FakeNavController().createSpy();
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', { registerUserImages: of({}) });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [KycConfirmationPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: UserKycKriptonImagesService, useValue: userKycKriptonImagesServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KycConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show front_document on screen', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();

    expect(component.image).toEqual('http://localhost:9876/assets/test_image.svg');
  });

  it('should redirect to back id page', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const contentEl = fixture.debugElement.query(By.css('app-confirmation-content'));
    contentEl.triggerEventHandler('confirm', null);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/kyc/validation/back_id');
  });

  it('should redirect to simplified wallet home when digital document is dni_selfie and is warranty wallet', fakeAsync(() => {
    fakeActivatedRoute.modifySnapshotParams({ digitalDocument: 'dni_selfie' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    const contentEl = fixture.debugElement.query(By.css('app-confirmation-content'));
    contentEl.triggerEventHandler('confirm', null);
    tick();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
    expect(kriptonStorageSpy.set).toHaveBeenCalledOnceWith('user_status', 'COMPLETE');
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('simplified-home-wallet', {
      queryParams: { showRegistrationModal: true },
    });
    expect(fiatRampsServiceSpy.registerUserImages).toHaveBeenCalledTimes(1);
  }));

  it('should redirect to tabs wallet and open km registration modal when digital document is dni_selfie and is not warranty wallet', fakeAsync(() => {
    fakeActivatedRoute.modifySnapshotParams({ digitalDocument: 'dni_selfie' });
    ionicStorageServiceSpy.get.and.resolveTo(false);
    component.ionViewWillEnter();
    fixture.detectChanges();
    const contentEl = fixture.debugElement.query(By.css('app-confirmation-content'));
    contentEl.triggerEventHandler('confirm', null);
    tick();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
    expect(kriptonStorageSpy.set).toHaveBeenCalledOnceWith('user_status', 'COMPLETE');
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('tabs/wallets');
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.registerUserImages).toHaveBeenCalledTimes(1);
  }));

  it('should redirect to validation page when reload is clicked', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const contentEl = fixture.debugElement.query(By.css('app-confirmation-content'));
    contentEl.triggerEventHandler('reload', null);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/fiat-ramps/kyc/validation/front_id');
  });

  it('should navigate back if modal confirmed', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-confirmation-content')).triggerEventHandler('back', null);
    fixture.detectChanges();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/fiat-ramps/user-register');
  }));

  it('should not navigate back if modal canceled', fakeAsync(() => {
    fakeModalController.modifyReturns(null, { role: 'cancel' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-confirmation-content')).triggerEventHandler('back', null);
    fixture.detectChanges();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).not.toHaveBeenCalled();
  }));
});
