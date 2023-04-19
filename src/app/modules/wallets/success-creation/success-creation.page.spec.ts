import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { SuccessCreationPage } from './success-creation.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { By } from '@angular/platform-browser';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TrackedWalletAddress } from 'src/app/shared/models/tracked-wallet-address/tracked-wallet-address';
import { TrackedWalletAddressInjectable } from 'src/app/shared/models/tracked-wallet-address/injectable/tracked-wallet-address.injectable';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';

describe('SuccessCreationPage', () => {
  let component: SuccessCreationPage;
  let fixture: ComponentFixture<SuccessCreationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessCreationPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let trackedWalletAddressSpy: jasmine.SpyObj<TrackedWalletAddress>;
  let trackedWalletAddressInjectableSpy: jasmine.SpyObj<TrackedWalletAddressInjectable>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    fakeModalController = new FakeModalController(null, {});
    modalControllerSpy = fakeModalController.createSpy();
    trackedWalletAddressSpy = jasmine.createSpyObj('TrackedWalletAddress', {
      value: null,
    });
    trackedWalletAddressInjectableSpy = jasmine.createSpyObj('TrackedWalletAddressInjectable', {
      create: trackedWalletAddressSpy,
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
    });

    TestBed.configureTestingModule({
      declarations: [FakeTrackClickDirective, SuccessCreationPage],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: TrackedWalletAddressInjectable, useValue: trackedWalletAddressInjectableSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessCreationPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const imgEl = fixture.debugElement.query(By.css('.header__ux_success_image img'));
    const titleEl = fixture.debugElement.query(By.css('.main__primary_text ion-text'));
    const subtitleEl = fixture.debugElement.query(By.css('.main__secondary_text ion-text'));
    expect(imgEl.attributes.src).toContain('assets/img/wallets/success_creation.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.success_creation.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('wallets.success_creation.subtitle');
  });

  it('should open modal when ux_create_skip Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_create_skip');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should track screenview event and track wallet address on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
    expect(trackedWalletAddressSpy.value).toHaveBeenCalledTimes(1);
  });

  it('should set correct states of steps if wallet is protected', async () => {
    const stepOne = component.steps.find((step) => step.order === '1');
    const stepTwo = component.steps.find((step) => step.order === '2');
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(stepOne.completed).toBeTrue();
    expect(stepTwo.disabled).toBeFalse();
  });
});
