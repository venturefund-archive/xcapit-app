import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { KycFrontIdValidationPage } from './kyc-front-id-validation.page';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('KycFrontIdValidationPage', () => {
  let component: KycFrontIdValidationPage;
  let fixture: ComponentFixture<KycFrontIdValidationPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    fakeModalController = new FakeModalController(null, { role: 'confirm' });
    modalControllerSpy = fakeModalController.createSpy();

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [KycFrontIdValidationPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KycFrontIdValidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screen view on will enter', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate back if modal confirmed', fakeAsync(() => {
    fixture.debugElement.query(By.css('app-validation-content')).triggerEventHandler('backButton', null);
    fixture.detectChanges();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/fiat-ramps/user-register');
  }));

  it('should not navigate back if modal canceled', fakeAsync(() => {
    fakeModalController.modifyReturns(null, { role: 'cancel' });
    fixture.debugElement.query(By.css('app-validation-content')).triggerEventHandler('backButton', null);
    fixture.detectChanges();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).not.toHaveBeenCalled();
  }));

  it('should redirect to front id confirmation page', () => {
    const contentEl = fixture.debugElement.query(By.css('app-validation-content'));
    contentEl.triggerEventHandler('confirm', null);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/kyc-front-id-confirmation');
  });
});
