import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, fakeAsync, TestBed, TestBedStatic, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';
import { TrackClickUnauthDirective } from 'src/app/shared/directives/track-click-unauth/track-click-unauth.directive';
import { TrackClickUnauthDirectiveTestHelper } from 'src/testing/track-click-unauth-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let apiUsuariosSpy: any;
  let apiUsuariosService: any;
  let subscriptionsService: any;
  let subscriptionsServiceSpy: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<LoginPage>;
  let navControllerSpy: any;
  let googleAuthPluginMock: any;
  let googleAuthPluginSpy: any;

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
      apiUsuariosSpy = jasmine.createSpyObj('ApiUsuariosService', ['login', 'loginWithGoogle', 'status']);
      apiUsuariosSpy.login.and.returnValue(of({}));
      apiUsuariosSpy.loginWithGoogle.and.returnValue(of({}));
      apiUsuariosSpy.status.and.returnValue(of({ status_name: 'COMPLETE' }));
      subscriptionsServiceSpy = jasmine.createSpyObj('SubscriptionsService', ['checkStoredLink']);
      subscriptionsServiceSpy.checkStoredLink.and.returnValue(Promise.resolve(true));
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      googleAuthPluginMock = { signIn: () => Promise.resolve() };
      googleAuthPluginSpy = jasmine.createSpyObj('GoogleAuth', googleAuthPluginMock);
      googleAuthPluginSpy.signIn.and.returnValue(Promise.resolve({ authentication: { idToken: '' } }));
      TestBed.configureTestingModule({
        declarations: [LoginPage, AuthFormComponent, TrackClickUnauthDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'users/register', component: DummyComponent },
            { path: 'tabs/home', component: DummyComponent },
            { path: 'tutorials/first-steps', component: DummyComponent },
            { path: 'users/reset-password', component: DummyComponent },
          ]),
          ReactiveFormsModule,
          IonicModule,
        ],
        providers: [
          TrackClickUnauthDirective,
          { provide: ApiUsuariosService, useValue: apiUsuariosSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: SubscriptionsService, useValue: subscriptionsServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    apiUsuariosService = TestBed.inject(ApiUsuariosService);
    component = fixture.componentInstance;
    component.googleAuthPlugin = googleAuthPluginSpy;
    trackClickUnauthDirectiveHelper = new TrackClickUnauthDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call success from loginUser', () => {
    const spy = spyOn(component, 'success');
    component.loginUser(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should reset form on success', () => {
    const spy = spyOn(component.loginForm.form, 'reset');
    component.success();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call checkStoredLink on success', () => {
    component.success();
    expect(subscriptionsService.checkStoredLink).toHaveBeenCalledTimes(1);
  });

  it('should call status on storedLink not exists', async () => {
    subscriptionsService.checkStoredLink.and.returnValue(Promise.resolve(false));
    await component.success();
    expect(apiUsuariosService.status).toHaveBeenCalledTimes(1);
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

  it('should call success after successful login with Google', async () => {
    const spy = spyOn(component, 'success');
    await component.googleSingUp();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call success if user closed login with Google window', async () => {
    const spy = spyOn(component, 'success');
    googleAuthPluginSpy.signIn.and.throwError('User closed window');
    await component.googleSingUp();
    expect(spy).toHaveBeenCalledTimes(0);
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
