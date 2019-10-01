import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordPage } from './reset-password.page';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ResetPasswordFormComponent } from '../shared-usuarios/components/reset-password-form/reset-password-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { DummyComponent } from 'src/testing/dummy.component.spec';

describe('ResetPasswordPage', () => {
  let component: ResetPasswordPage;
  let fixture: ComponentFixture<ResetPasswordPage>;
  let apiUsuariosServiceSpy: any;
  let navControllerSpy: any;

  beforeEach(async(() => {
    apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', [
      'resetPassword',
      'sendResetPasswordEmail'
    ]);
    apiUsuariosServiceSpy.resetPassword.and.returnValue(null);
    apiUsuariosServiceSpy.sendResetPasswordEmail.and.returnValue(null);
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateBack']);
    navControllerSpy.navigateBack.and.returnValue(of({}).toPromise());
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'users/login', component: DummyComponent }
        ])
      ],
      declarations: [
        ResetPasswordPage,
        ResetPasswordFormComponent,
        DummyComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    expect(apiUsuariosServiceSpy.sendResetPasswordEmail).toHaveBeenCalledTimes(
      1
    );
    expect(apiUsuariosServiceSpy.resetPassword).toHaveBeenCalledTimes(0);
  });

  it('should call resetPassword from handleSubmit when isReset is true', () => {
    component.isReset = true;
    apiUsuariosServiceSpy.resetPassword.and.returnValue(of({}));
    component.handleSubmit(null);
    expect(apiUsuariosServiceSpy.resetPassword).toHaveBeenCalledTimes(1);
    expect(apiUsuariosServiceSpy.sendResetPasswordEmail).toHaveBeenCalledTimes(
      0
    );
  });

  it('should reset form on success', () => {
    const spy = spyOn(component.formComponent.form, 'reset');
    component.success().then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('should call navigateBack with ["/users/login"] and { replaceUrl: true }, on navController when from success', () => {
    component.success().then(() => {
      expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(
        ['/users/login'],
        { replaceUrl: true }
      );
    });
  });
});
