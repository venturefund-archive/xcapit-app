import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickUnauthDirective } from 'src/app/shared/directives/track-click-unauth/track-click-unauth.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { TrackClickUnauthDirectiveTestHelper } from 'src/testing/track-click-unauth-directive-test.helper';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';

import { ResendVerificationEmailPage } from './resend-verification-email.page';

describe('ResendVerificationEmailPage', () => {
  let component: ResendVerificationEmailPage;
  let fixture: ComponentFixture<ResendVerificationEmailPage>;
  let apiUsuariosServiceSpy: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<ResendVerificationEmailPage>;

  beforeEach(
    waitForAsync(() => {
      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', [
        'sendEmailValidation'
      ]);

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
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
        ],
      }).compileComponents();

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

  it('should call resendEmail on ionViewWillEnter', () => {
    const spy = spyOn(component, 'resendEmail');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should disable resend button after calling resendEmail', () => {
    component.resendEmail();
    expect(component.disableResendEmail).toBeTrue();
  });

  it('should enable resend button when timerSeconds reaches 0', () => {
    component.resendEmail();
    component.timerSeconds = 1; // timerSeconds is decreased when decreaseTimer is called
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
    component.decreaseTimer(); // timerSeconds is decreased when decreaseTimer is called
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // WIP
  // it('should call sendEmailValidation on resendEmail', () => {
  //   apiUsuariosServiceSpy.sendEmailValidation.and.returnValue(of({}));
  //   component.resendEmail();
  //   expect(apiUsuariosServiceSpy.sendEmailValidation).toHaveBeenCalledTimes(1);
  // });

  it('should call trackEvent on trackService when Resend Verification Email button clicked', () => {
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
