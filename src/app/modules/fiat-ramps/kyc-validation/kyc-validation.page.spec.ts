import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { KycValidationPage } from './kyc-validation.page';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';
import { ActivatedRoute } from '@angular/router';

describe('KycValidationPage', () => {
  let component: KycValidationPage;
  let fixture: ComponentFixture<KycValidationPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(waitForAsync(() => {
    fakeActivatedRoute = new FakeActivatedRoute({ digitalDocument: 'front_id' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    fakeModalController = new FakeModalController(null, { role: 'confirm' });
    modalControllerSpy = fakeModalController.createSpy();

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [KycValidationPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KycValidationPage);
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

  it('should not track screen view on will enter when digital document is not front_id', () => {
    fakeActivatedRoute.modifySnapshotParams({ digitalDocument: 'back_id' });
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).not.toHaveBeenCalled();
  });

  it('should navigate back if modal confirmed', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-validation-content')).triggerEventHandler('backButton', null);
    fixture.detectChanges();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/fiat-ramps/purchases');
  }));

  it('should not navigate back if modal canceled', fakeAsync(() => {
    fakeModalController.modifyReturns(null, { role: 'cancel' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-validation-content')).triggerEventHandler('backButton', null);
    fixture.detectChanges();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).not.toHaveBeenCalled();
  }));

  it('should redirect to front id confirmation page', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const contentEl = fixture.debugElement.query(By.css('app-validation-content'));
    contentEl.triggerEventHandler('confirm', null);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/kyc/confirmation/front_id');
  });
});
