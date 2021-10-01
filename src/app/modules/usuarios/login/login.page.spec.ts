import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';
import { TrackClickUnauthDirective } from 'src/app/shared/directives/track-click-unauth/track-click-unauth.directive';
import { TrackClickUnauthDirectiveTestHelper } from 'src/testing/track-click-unauth-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { LocalNotificationsService } from '../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let apiUsuariosSpy: any;
  let subscriptionsServiceSpy: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<LoginPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  let googleAuthPluginSpy: any;
  let notificationsServiceSpy: any;
  let pwaNotificationServiceSpy: any;
  let localNotificationServiceSpy: any;
  const formData = {
    valid: {
      email: 'test@test.com',
      repeat_email: 'test@test.com',
      password: 'TestPass1234',
      repeat_password: 'TestPass1234',
    },
  };

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      apiUsuariosSpy = jasmine.createSpyObj('ApiUsuariosService', {
        login: of({}),
        loginWithGoogle: of({}),
        status: of({ status_name: 'COMPLETE' }),
      });
      subscriptionsServiceSpy = jasmine.createSpyObj('SubscriptionsService', {
        checkStoredLink: Promise.resolve(false),
      });
      googleAuthPluginSpy = jasmine.createSpyObj('GoogleAuth', {
        signIn: Promise.resolve({ authentication: { idToken: '' } }),
      });

      pwaNotificationServiceSpy = jasmine.createSpyObj('PwaNotificationsService', ['init']);
      notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', {
        getInstance: pwaNotificationServiceSpy,
      });
      localNotificationServiceSpy = jasmine.createSpyObj('LocalNotificationsService', ['init']);
      TestBed.configureTestingModule({
        declarations: [LoginPage, AuthFormComponent, TrackClickUnauthDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule, IonicModule],
        providers: [
          TrackClickUnauthDirective,
          { provide: ApiUsuariosService, useValue: apiUsuariosSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: SubscriptionsService, useValue: subscriptionsServiceSpy },
          { provide: NotificationsService, useValue: notificationsServiceSpy },
          { provide: LocalNotificationsService, useValue: localNotificationServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    component.googleAuthPlugin = googleAuthPluginSpy;
    trackClickUnauthDirectiveHelper = new TrackClickUnauthDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set up on login success without stored link', async () => {
    const spy = spyOn(component.loginForm.form, 'reset');
    await component.loginUser({});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(1);
    expect(pwaNotificationServiceSpy.init).toHaveBeenCalledTimes(1);
    expect(subscriptionsServiceSpy.checkStoredLink).toHaveBeenCalledTimes(1);
    expect(apiUsuariosSpy.status).toHaveBeenCalledTimes(1);
    expect(localNotificationServiceSpy.init).toHaveBeenCalledTimes(1);
  });

  it('should not call user service status when stored link', async () => {
    subscriptionsServiceSpy.checkStoredLink.and.returnValue(Promise.resolve(true));
    await component.loginUser({});
    await fixture.whenStable();
    expect(apiUsuariosSpy.status).not.toHaveBeenCalled();
  });

  it('should redirect to fund list when status is COMPLETE', () => {
    const url = component.getUrlByStatus('COMPLETE');
    expect(url).toEqual(['tabs/home']);
  });

  it('should redirect to fund list when status is CREATOR', () => {
    const url = component.getUrlByStatus('CREATOR');
    expect(url).toEqual(['tabs/home']);
  });

  it('should redirect to fund list when status is EXPLORER', () => {
    const url = component.getUrlByStatus('EXPLORER');
    expect(url).toEqual(['tabs/home']);
  });

  it('should redirect to first steps when status is BEGINNER', () => {
    const url = component.getUrlByStatus('BEGINNER');
    expect(url).toEqual(['tutorials/first-steps']);
  });

  it('should call signIn on googleSingUp', async () => {
    await component.googleSingUp();
    expect(googleAuthPluginSpy.signIn).toHaveBeenCalledTimes(1);
  });

  it('should call loginWithGoogle on googleSingUp', async () => {
    await component.googleSingUp();
    expect(apiUsuariosSpy.loginWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('should set up login with Google', async () => {
    const spy = spyOn(component.loginForm.form, 'reset');
    await component.googleSingUp();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(1);
    expect(pwaNotificationServiceSpy.init).toHaveBeenCalledTimes(1);
    expect(subscriptionsServiceSpy.checkStoredLink).toHaveBeenCalledTimes(1);
    expect(apiUsuariosSpy.status).toHaveBeenCalledTimes(1);
    expect(localNotificationServiceSpy.init).toHaveBeenCalledTimes(1);
    expect(apiUsuariosSpy.loginWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('should not call login with google if user closed login with Google window', async () => {
    googleAuthPluginSpy.signIn.and.throwError('User closed window');
    await component.googleSingUp();
    expect(apiUsuariosSpy.loginWithGoogle).toHaveBeenCalledTimes(0);
  });

  it('should not call loginWithGoogle if user closed login with Google window', async () => {
    googleAuthPluginSpy.signIn.and.throwError('User closed window');
    await component.googleSingUp();
    expect(apiUsuariosSpy.loginWithGoogle).toHaveBeenCalledTimes(0);
  });

  it('should call trackEvent on trackService when Google Auth button clicked', () => {
    fixture.detectChanges();
    component.loginForm.form.patchValue(formData.valid);
    fixture.detectChanges();
    expect(component.loginForm.form.valid).toBeTruthy();
    const el = trackClickUnauthDirectiveHelper.getByElementByName('ion-button', 'Google Auth');
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Login button clicked', () => {
    fixture.detectChanges();
    component.loginForm.form.patchValue(formData.valid);
    fixture.detectChanges();
    expect(component.loginForm.form.valid).toBeTruthy();
    const el = trackClickUnauthDirectiveHelper.getByElementByName('ion-button', 'Login');
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Register button clicked', () => {
    const el = trackClickUnauthDirectiveHelper.getByElementByName('ion-button', 'Go To Register');
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Reset Password button clicked', () => {
    const el = trackClickUnauthDirectiveHelper.getByElementByName('ion-button', 'Reset Password');
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
