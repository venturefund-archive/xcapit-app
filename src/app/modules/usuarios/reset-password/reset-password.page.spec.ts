import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordPage } from './reset-password.page';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ResetPasswordFormComponent } from '../shared-usuarios/components/reset-password-form/reset-password-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('ResetPasswordPage', () => {
  let component: ResetPasswordPage;
  let fixture: ComponentFixture<ResetPasswordPage>;
  let apiUsuariosServiceSpy: any;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ResetPasswordPage>;
  beforeEach(
    waitForAsync(() => {
      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', ['resetPassword', 'sendResetPasswordEmail']);
      apiUsuariosServiceSpy.resetPassword.and.returnValue(null);
      apiUsuariosServiceSpy.sendResetPasswordEmail.and.returnValue(null);
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      navControllerSpy.navigateForward.and.returnValue(of({}).toPromise());
      TestBed.configureTestingModule({
        imports: [
          IonicModule,
          ReactiveFormsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([{ path: 'users/success-reset/:isReset', component: DummyComponent }]),
        ],
        declarations: [ResetPasswordPage, ResetPasswordFormComponent, DummyComponent, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should isReset is false when token is falsy', () => {
    component.uidb64 = 'asdf';
    component.setIsReset();
    expect(component.isReset).toBe(false);
  });

  it('should isReset is false when uidb64 is falsy', () => {
    component.token = 'asdf';
    component.setIsReset();
    expect(component.isReset).toBe(false);
  });

  it('should isReset is false when token and uidb64 are falsy', () => {
    component.uidb64 = undefined;
    component.token = undefined;
    component.setIsReset();
    expect(component.isReset).toBe(false);
  });

  it('should isReset is not false when token and uidb64 are not falsy', () => {
    component.uidb64 = 'asdf';
    component.token = 'asdf';
    component.setIsReset();
    expect(component.isReset).toBe(true);
  });

  it('should call success from handleSubmit', () => {
    apiUsuariosServiceSpy.sendResetPasswordEmail.and.returnValue(of({}));
    const spy = spyOn(component, 'success');
    component.handleSubmit(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call sendResetPasswordEmail from handleSubmit when isReset is false', () => {
    component.isReset = false;
    apiUsuariosServiceSpy.sendResetPasswordEmail.and.returnValue(of({}));
    component.handleSubmit(null);
    expect(apiUsuariosServiceSpy.sendResetPasswordEmail).toHaveBeenCalledTimes(1);
    expect(apiUsuariosServiceSpy.resetPassword).toHaveBeenCalledTimes(0);
  });

  it('should call resetPassword from handleSubmit when isReset is true', () => {
    component.isReset = true;
    apiUsuariosServiceSpy.resetPassword.and.returnValue(of({}));
    component.handleSubmit(null);
    expect(apiUsuariosServiceSpy.resetPassword).toHaveBeenCalledTimes(1);
    expect(apiUsuariosServiceSpy.sendResetPasswordEmail).toHaveBeenCalledTimes(0);
  });

  it('should call navigateForward with ["/users/success-reset", false] and { replaceUrl: true }, on navController when from success', async () => {
    component.isReset = false;
    await component.success();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/users/success-reset', false], {
      replaceUrl: true,
    });
  });

  it('should call navigateForward with ["/users/success-reset", true] and { replaceUrl: true }, on navController when from success', async () => {
    component.isReset = true;
    await component.success();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/users/success-reset', true], {
      replaceUrl: true,
    });
  });

  it('should call trackEvent on trackService when Reset Password Email is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Reset Password Email');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Reset Password Confirm is clicked', () => {
    component.isReset = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Reset Password Confirm');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
