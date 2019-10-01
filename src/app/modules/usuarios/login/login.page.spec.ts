import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let apiUsuariosSpy: any;
  let subscriptionsService: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<
    LoginPage
  >;

  const formData = {
    valid: {
      email: 'test@test.com',
      repeat_email: 'test@test.com',
      password: 'TestPass1234',
      repeat_password: 'TestPass1234'
    }
  };

  beforeEach(async(() => {
    apiUsuariosSpy = jasmine.createSpyObj('ApiUsuariosService', ['login']);
    apiUsuariosSpy.login.and.returnValue(of({}));
    subscriptionsService = jasmine.createSpyObj('SubscriptionsService', [
      'checkStoredLink'
    ]);
    subscriptionsService.checkStoredLink.and.returnValue(true);
    TestBed.configureTestingModule({
      declarations: [
        LoginPage,
        AuthFormComponent,
        TrackClickUnauthDirective,
        DummyComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'users/register', component: DummyComponent },
          { path: 'users/reset-password', component: DummyComponent }
        ]),
        ReactiveFormsModule,
        IonicModule
      ],
      providers: [
        TrackClickUnauthDirective,
        { provide: ApiUsuariosService, useValue: apiUsuariosSpy },
        { provide: SubscriptionsService, useValue: subscriptionsService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    trackClickUnauthDirectiveHelper = new TrackClickUnauthDirectiveTestHelper(
      fixture
    );
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

  it('should call trackEvent on trackService when Login button clicked', () => {
    fixture.detectChanges();
    component.loginForm.form.patchValue(formData.valid);
    fixture.detectChanges();
    expect(component.loginForm.form.valid).toBeTruthy();
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Login'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Register button clicked', () => {
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Go To Register'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Reset Password button clicked', () => {
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Reset Password'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
