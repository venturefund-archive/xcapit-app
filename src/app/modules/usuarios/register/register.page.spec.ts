import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickUnauthDirectiveTestHelper } from 'src/testing/track-click-unauth-directive-test.helper';
import { TrackClickUnauthDirective } from 'src/app/shared/directives/track-click-unauth/track-click-unauth.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { convertToParamMap, ActivatedRoute } from '@angular/router';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let apiUsuariosMock: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<
    RegisterPage
  >;
  let activatedRouteMock: any;
  beforeEach(async(() => {
    apiUsuariosMock = {
      crud: {
        create: (data: any) => of(data)
      }
    };
    activatedRouteMock = {};
    TestBed.configureTestingModule({
      declarations: [
        DummyComponent,
        RegisterPage,
        AuthFormComponent,
        TrackClickUnauthDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'users/login', component: DummyComponent }
        ]),
        ReactiveFormsModule,
        IonicModule
      ],
      providers: [
        TrackClickUnauthDirective,
        { provide: ApiUsuariosService, useValue: apiUsuariosMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    trackClickUnauthDirectiveHelper = new TrackClickUnauthDirectiveTestHelper(
      fixture
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when openTOS is called', () => {
    spyOn(window, 'open');
    component.openTOS();
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('should call success from regiterUser', () => {
    const spy = spyOn(component, 'success').and.returnValue(null);
    component.registerUser(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should reset form on success', () => {
    const spy = spyOn(component.registerForm.form, 'reset').and.returnValue(
      null
    );
    component.success();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Register button clicked', () => {
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Register'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Login button clicked', () => {
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Go To Login'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Open TOS button clicked', () => {
    spyOn(window, 'open');
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Open TOS'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call setReferralCode & setEmail on ionViewWillEnter', () => {
    const setReferralCodeSpy = spyOn(component, 'setReferralCode');
    const setEmailSpy = spyOn(component, 'setEmail');
    component.ionViewWillEnter();
    expect(setReferralCodeSpy).toHaveBeenCalledTimes(1);
    expect(setEmailSpy).toHaveBeenCalledTimes(1);
  });

  describe('with referral code', () => {
    beforeEach(() => {
      activatedRouteMock = TestBed.inject(ActivatedRoute);
    });

    it('should set referral code and a valid email ionViewWillEnter', () => {
      activatedRouteMock.snapshot = {
        paramMap: convertToParamMap({
          code: 'asfd12',
          email: 'dGVzdEB0ZXN0LmNvbQ==' // test@test.com
        })
      };
      component.ionViewWillEnter();
      expect(component.registerForm.form.get('referral_code').value).toEqual('asfd12');
      expect(component.registerForm.form.get('manual_referral').value).toBeTruthy();
      expect(component.registerForm.form.get('email').value).toEqual(
        'test@test.com'
      );
    });

    it('should set referral code and a invalid email ionViewWillEnter', () => {
      activatedRouteMock.snapshot = {
        paramMap: convertToParamMap({
          code: 'asfd12',
          email: 'dGVzdEB0ZXN0LmNvb'
        })
      };
      component.ionViewWillEnter();
      expect(component.registerForm.form.get('referral_code').value).toEqual('asfd12');
      expect(component.registerForm.form.get('manual_referral').value).toBeTruthy();
      expect(component.registerForm.form.get('email').value).toEqual('');
    });
  });
});
