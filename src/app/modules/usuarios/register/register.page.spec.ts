import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { alertControllerMock } from '../../../../testing/spies/alert-controller-mock.spec';
import { TrackService } from '../../../shared/services/track/track.service';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { of } from 'rxjs';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let apiUsuariosMock: any;
  let activatedRouteMock: any;
  let navControllerSpy: any;
  let alertControllerSpy: any;
  let trackServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RegisterPage>;
  beforeEach(
    waitForAsync(() => {
      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);
      apiUsuariosMock = {
        crud: {
          create: (data: any) => of(data),
        },
      };
      activatedRouteMock = {};
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      trackServiceSpy = jasmine.createSpyObj('TrackService', ['trackSignUp']);
      TestBed.configureTestingModule({
        declarations: [DummyComponent, RegisterPage, AuthFormComponent, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule, IonicModule],
        providers: [
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: ApiUsuariosService, useValue: apiUsuariosMock },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: NavController, useValue: navControllerSpy },
          { provide: AlertController, useValue: alertControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when openTOS is called', () => {
    spyOn(window, 'open');
    component.openTOS();
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('should call track sign up on register', () => {
    component.success({});
    expect(trackServiceSpy.trackSignUp).toHaveBeenCalledTimes(1);
  });

  it('should call success from regiterUser', () => {
    const spy = spyOn(component, 'success').and.returnValue(null);
    component.registerUser(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should pass the user email on resendVerificationEmail', () => {
    const response = { email: 'test@test.com' };
    const options = jasmine.objectContaining({
      state: { email: response.email },
    });
    component.success(response);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(jasmine.any(Array), options);
  });

  it('should reset form on success', () => {
    const spy = spyOn(component.registerForm.form, 'reset').and.returnValue(null);
    component.success('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Register button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Register');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Login button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Login');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Open TOS button clicked', () => {
    spyOn(window, 'open');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Open TOS');
    const directive = trackClickDirectiveHelper.getDirective(el);
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

  it('should call alert controller create when showWhiteListAlert is called', () => {
    component.showWhiteListAlert();
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call window.open when openWaitingList is called', () => {
    spyOn(window, 'open');
    component.openWaitingList();
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  describe('with referral code', () => {
    beforeEach(() => {
      activatedRouteMock = TestBed.inject(ActivatedRoute);
    });

    it('should set referral code and a valid email ionViewWillEnter', () => {
      activatedRouteMock.snapshot = {
        paramMap: convertToParamMap({
          code: 'asfd12',
          email: 'dGVzdEB0ZXN0LmNvbQ==', // test@test.com
        }),
      };
      component.ionViewWillEnter();
      expect(component.registerForm.form.get('referral_code').value).toEqual('asfd12');
      expect(component.registerForm.form.get('manual_referral').value).toBeTruthy();
      expect(component.registerForm.form.get('email').value).toEqual('test@test.com');
    });

    it('should set referral code and a invalid email ionViewWillEnter', () => {
      activatedRouteMock.snapshot = {
        paramMap: convertToParamMap({
          code: 'asfd12',
          email: 'dGVzdEB0ZXN0LmNvb',
        }),
      };
      component.ionViewWillEnter();
      expect(component.registerForm.form.get('referral_code').value).toEqual('asfd12');
      expect(component.registerForm.form.get('manual_referral').value).toBeTruthy();
      expect(component.registerForm.form.get('email').value).toEqual('');
    });
  });
});
