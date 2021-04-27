import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { TrackClickUnauthDirective } from 'src/app/shared/directives/track-click-unauth/track-click-unauth.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickUnauthDirectiveTestHelper } from 'src/testing/track-click-unauth-directive-test.helper';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { Storage } from '@ionic/storage';
import { ResendVerificationEmailPage } from './resend-verification-email.page';

const extras = {
  extras: {
    state: {
      email: 'test@test.com',
    },
  },
};

describe('ResendVerificationEmailPage', () => {
  let component: ResendVerificationEmailPage;
  let fixture: ComponentFixture<ResendVerificationEmailPage>;
  let apiUsuariosServiceSpy: any;
  let activatedRouteMock: any;
  let navControllerSpy: any;
  let storageSpy: any;
  let currentNavigation: Navigation;
  let getCurrentNavigationSpy: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<ResendVerificationEmailPage>;

  beforeEach(
    waitForAsync(() => {
      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', [
        'sendEmailValidationByEmail',
      ]);
      apiUsuariosServiceSpy.sendEmailValidationByEmail.and.returnValue(
        new Observable()
      );
      activatedRouteMock = {
        queryParams: new Subject(),
      };
      navControllerSpy = jasmine.createSpyObj(
        'NavController',
        navControllerMock
      );
      storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
      storageSpy.get.and.returnValue(Promise.resolve());
      TestBed.configureTestingModule({
        declarations: [
          DummyComponent,
          ResendVerificationEmailPage,
          TrackClickUnauthDirective,
        ],
        imports: [
          HttpClientTestingModule,
          IonicModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'users/login', component: DummyComponent },
            { path: 'tickets/create-ticket', component: DummyComponent },
          ]),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          TrackClickUnauthDirective,
          { provide: NavController, useValue: navControllerSpy },
          { provide: Storage, useValue: storageSpy },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
        ],
      }).compileComponents();

      var router = TestBed.inject(Router);
      currentNavigation = router.getCurrentNavigation();
      getCurrentNavigationSpy = spyOn(
        router,
        'getCurrentNavigation'
      ).and.returnValue({ ...currentNavigation, ...extras });

      fixture = TestBed.createComponent(ResendVerificationEmailPage);
      component = fixture.componentInstance;
      trackClickUnauthDirectiveHelper = new TrackClickUnauthDirectiveTestHelper(
        fixture
      );
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should recieve user email if redirected from success-register', () => {
    activatedRouteMock.queryParams.next();
    expect(component.email).toEqual(extras.extras.state.email);
  });

  it('should save data in storage if redirected from success-register', () => {
    activatedRouteMock.queryParams.next();
    expect(storageSpy.set).toHaveBeenCalledWith('email', jasmine.any(String));
    expect(storageSpy.set).toHaveBeenCalledWith(
      'numberOfResends',
      jasmine.any(Number)
    );
  });

  it('should call sendEmailValidationByEmail if redirected from success-register', () => {
    activatedRouteMock.queryParams.next();
    expect(
      apiUsuariosServiceSpy.sendEmailValidationByEmail
    ).toHaveBeenCalledTimes(1);
  });

  it('should not call sendEmailValidationByEmail if page was reloaded', () => {
    getCurrentNavigationSpy.and.returnValue(currentNavigation);
    activatedRouteMock.queryParams.next();
    expect(
      apiUsuariosServiceSpy.sendEmailValidationByEmail
    ).toHaveBeenCalledTimes(0);
  });

  it('should redirect to login if page was reloaded and no user data in storage', async () => {
    const spy = spyOn(component, 'close');
    getCurrentNavigationSpy.and.returnValue(currentNavigation);
    activatedRouteMock.queryParams.next();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('should call startTimer if page was reloaded and there is user data in storage', async () => {
    const spy = spyOn(component, 'startTimer').and.returnValue(
      Promise.resolve()
    );
    getCurrentNavigationSpy.and.returnValue(currentNavigation);
    storageSpy.get
      .withArgs('email')
      .and.returnValue(Promise.resolve(extras.extras.state.email))
      .withArgs('numberOfResends')
      .and.returnValue(Promise.resolve(1));
    activatedRouteMock.queryParams.next();
    await fixture.whenStable();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('should get data from storage if page was reloaded and there is user data in storage', async () => {
    getCurrentNavigationSpy.and.returnValue(currentNavigation);
    storageSpy.get
      .withArgs('email')
      .and.returnValue(Promise.resolve(extras.extras.state.email))
      .withArgs('numberOfResends')
      .and.returnValue(Promise.resolve(1));
    activatedRouteMock.queryParams.next();
    await fixture.whenStable();
    fixture
      .whenStable()
      .then(() => expect(component.email).toBe(extras.extras.state.email));
  });

  it('should show Create Ticket Button if page was reloaded and user made minimumNumberOfTriesForTicket or more resends', async () => {
    getCurrentNavigationSpy.and.returnValue(currentNavigation);
    storageSpy.get
      .withArgs('email')
      .and.returnValue(Promise.resolve(extras.extras.state.email))
      .withArgs('numberOfResends')
      .and.returnValue(
        Promise.resolve(component.minimumNumberOfTriesForTicket)
      );
    activatedRouteMock.queryParams.next();
    await fixture.whenStable();
    fixture
      .whenStable()
      .then(() => expect(component.hideSendTicket).toBeFalse());
  });

  it('should disable Resend Verification Email Button if page was reloaded and there is user data in storage', async () => {
    getCurrentNavigationSpy.and.returnValue(currentNavigation);
    storageSpy.get
      .withArgs('email')
      .and.returnValue(Promise.resolve(extras.extras.state.email))
      .withArgs('numberOfResends')
      .and.returnValue(Promise.resolve(1));
    activatedRouteMock.queryParams.next();
    await fixture.whenStable();
    fixture
      .whenStable()
      .then(() => expect(component.disableResendEmail).toBeTrue());
  });

  it('should not call sendEmailValidationByEmail if page was reloaded and there is user data in storage', async () => {
    getCurrentNavigationSpy.and.returnValue(currentNavigation);
    storageSpy.get
      .withArgs('email')
      .and.returnValue(Promise.resolve(extras.extras.state.email))
      .withArgs('numberOfResends')
      .and.returnValue(Promise.resolve(1));
    activatedRouteMock.queryParams.next();
    await fixture.whenStable();
    fixture
      .whenStable()
      .then(() =>
        expect(
          apiUsuariosServiceSpy.sendEmailValidationByEmail
        ).toHaveBeenCalledTimes(0)
      );
  });

  it('should call clearStorage when close is called', () => {
    const spy = spyOn(component, 'clearStorage');
    component.close();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call clearStorage when openTicket is called', () => {
    const spy = spyOn(component, 'clearStorage');
    component.openTicket();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should remove all keys on clearStorage', () => {
    component.clearStorage();
    expect(storageSpy.remove).toHaveBeenCalledWith('email');
    expect(storageSpy.remove).toHaveBeenCalledWith('numberOfResends');
  });

  it('should pass user email on openTicket', () => {
    component.email = extras.extras.state.email;
    component.openTicket();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(
      jasmine.any(Array),
      jasmine.objectContaining(extras.extras)
    );
  });

  it('should enable Resend Verification Email Button when timerSeconds reaches 0', () => {
    component.resendEmail();
    component.timerSeconds = 1;
    component.decreaseTimer();
    expect(component.disableResendEmail).toBeFalse();
  });

  it('should show Create Ticket Button after minimumNumberOfTriesForTicket resends', async () => {
    const numberOfResends: number = component.minimumNumberOfTriesForTicket;
    for (let i = 0; i < numberOfResends; i++) {
      component.resendEmail();
    }
    expect(component.hideSendTicket).toBeFalse();
  });

  it('should call setInterval on startTimer', () => {
    const spy = spyOn(window, 'setInterval');
    component.startTimer();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call clearInterval on decreaseTimer and timerSeconds 0', () => {
    const spy = spyOn(window, 'clearInterval');
    component.startTimer();
    component.timerSeconds = 1;
    component.decreaseTimer();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call sendEmailValidationByEmail on resendEmail', () => {
    component.resendEmail();
    expect(
      apiUsuariosServiceSpy.sendEmailValidationByEmail
    ).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Resend Verification Email button clicked', () => {
    activatedRouteMock.queryParams.next();
    fixture.detectChanges();
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Resend Verification Email'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Open Ticket button clicked', () => {
    activatedRouteMock.queryParams.next();
    component.hideSendTicket = false;
    fixture.detectChanges();
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Open Ticket'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
