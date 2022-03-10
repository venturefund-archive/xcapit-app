import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormComponent } from './auth-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  const formData = {
    valid: {
      email: 'email@email.com',
      pass: 'asdfF1',
      rCode: 'asd123',
      rTOS: true,
    },
    invalid: {
      email: 'fdaas',
      pass: 'dsfaaa',
      rCode: '',
      rTOS: false,
    },
  };

  beforeEach(
    waitForAsync(() => {
      toastServiceSpy = jasmine.createSpyObj('ToastService', ['dismiss']);
      TestBed.configureTestingModule({
        declarations: [AuthFormComponent],
        imports: [TranslateModule.forRoot(), ReactiveFormsModule, IonicModule],
        providers: [{ provide: ToastService, useValue: toastServiceSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleSubmit on submit event, valid form', () => {
    component.form.get('email').setValue(formData.valid.email);
    component.form.get('password').setValue(formData.valid.pass);
    const spy = spyOn(component, 'handleSubmit');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call emit on send, valid form', () => {
    component.form.get('email').setValue(formData.valid.email);
    component.form.get('password').setValue(formData.valid.pass);
    component.form.get('tos').setValue(formData.valid.rTOS);
    fixture.detectChanges();
    const spy = spyOn(component.send, 'emit');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call emit on send, invalid form', () => {
    component.handleSubmit();
    const spy = spyOn(component.send, 'emit');
    expect(spy).not.toHaveBeenCalled();
  });

  describe('Form values', () => {
    it('form should be invalid when fields are empty', async () => {
      component.form.get('email').setValue('');
      component.form.get('password').setValue('');
      component.form.get('tos').setValue(false);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be invalid when email field are not a valid email', async () => {
      component.form.get('email').setValue(formData.invalid.email);
      component.form.get('password').setValue(formData.valid.pass);
      component.form.get('tos').setValue(formData.valid.rTOS);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be invalid when passwords are not valid', async () => {
      component.form.get('email').setValue(formData.valid.email);
      component.form.get('password').setValue(formData.invalid.pass);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be invalid when TOS are not accepted', async () => {
      component.form.get('email').setValue(formData.valid.email);
      component.form.get('password').setValue(formData.valid.pass);
      component.form.get('tos').setValue(formData.invalid.rTOS);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be valid when referral_code is valid', async () => {
      component.form.get('email').setValue(formData.valid.email);
      component.form.get('password').setValue(formData.valid.pass);
      component.form.get('tos').setValue(formData.valid.rTOS);
      component.form.get('referral_code').setValue(formData.valid.rCode);
      expect(component.form.valid).toBeTruthy();
    });

    it('form should be valid when referrals_code is invalid or empty', async () => {
      component.form.get('email').setValue(formData.valid.email);
      component.form.get('password').setValue(formData.valid.pass);
      component.form.get('tos').setValue(formData.valid.rTOS);
      component.form.get('referral_code').setValue(formData.invalid.rCode);
      expect(component.form.valid).toBeTruthy();
    });

    it('should dismiss toast when any input is clicked', async () => {
      fixture.debugElement.query(By.css('app-ux-input[controlName="email"]')).nativeElement.click();
      fixture.debugElement.query(By.css('app-ux-input[controlName="password"]')).nativeElement.click();
      fixture.debugElement.query(By.css('app-ux-input[controlName="referral_code"]')).nativeElement.click();
      expect(toastServiceSpy.dismiss).toHaveBeenCalledTimes(3);
    });
  });
});
