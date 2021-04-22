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

fdescribe('ResendVerificationEmailPage', () => {
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
        'resendEmailValidation',
      ]);
      apiUsuariosServiceSpy.resendEmailValidation.and.returnValue(
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

  it('should call resendEmailValidation if redirected from success-register', () => {
    activatedRouteMock.queryParams.next();
    expect(apiUsuariosServiceSpy.resendEmailValidation).toHaveBeenCalledTimes(
      1
    );
  });

  it('should not call resendEmailValidation if page was reloaded', () => {
    getCurrentNavigationSpy.and.returnValue(currentNavigation);
    activatedRouteMock.queryParams.next();
    expect(apiUsuariosServiceSpy.resendEmailValidation).toHaveBeenCalledTimes(
      0
    );
  });

  it('should redirect to login if page was reloaded and no user data in storage', async () => {
    const spy = spyOn(component, 'close');
    getCurrentNavigationSpy.and.returnValue(currentNavigation);
    activatedRouteMock.queryParams.next();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('should call startTimer if page was reloaded and there is user data in storage', () => {
    const spy = spyOn(component, 'startTimer');
    getCurrentNavigationSpy.and.returnValue(currentNavigation);
    storageSpy.get
      .withArgs('email')
      .and.returnValue(Promise.resolve('test@test.com'))
      .withArgs('numberOfResends')
      .and.returnValue(Promise.resolve(1));
    activatedRouteMock.queryParams.next();

    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('should get data from storage if page was reloaded and there is user data in storage', () => {});

  it('should show Create Ticket Button if page was reloaded and user made 3 or more resends', () => {});

  it('should disable resend button if page was reloaded and there is user data in storage', () => {});

  it('should not call resendEmailValidation if page was reloaded and there is user data in storage', () => {});

  it('should not call resendEmailValidation if page was reloaded and there is user data in storage', () => {});

  it('should clear storage when close is called', () => {});

  it('should clear storage when openTicket is called', () => {});

  it('should remove all keys on clearStorage', () => {});

  it('should pass user email on openTicket', () => {});

  it('should enable resend button when timerSeconds reaches 0', () => {
    component.resendEmail();
    component.timerSeconds = 1;
    component.decreaseTimer();
    expect(component.disableResendEmail).toBeFalse();
  });

  it('should show create ticket button after minimumNumberOfTriesForTicket resends', () => {
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

  it('should call resendEmailValidation on resendEmail', () => {
    component.resendEmail();
    expect(apiUsuariosServiceSpy.resendEmailValidation).toHaveBeenCalledTimes(
      1
    );
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
