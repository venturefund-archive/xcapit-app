import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormComponent } from './auth-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;
  const formData = {
    valid: {
      email: 'email@email.com',
      rEmail: 'email@email.com',
      pass: 'asdfF1',
      rPass: 'asdfF1'
    },
    invalid: {
      email: 'fdaas',
      pass: 'dsfaaa',
      rPass: 'dsfaa'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthFormComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, IonicModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

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
    component.form.get('repeat_password').setValue(formData.valid.pass);
    const spy = spyOn(component, 'handleSubmit');
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('form'))
      .triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call emit on send, valid form', () => {
    component.form.get('email').setValue(formData.valid.email);
    component.form.get('repeat_email').setValue(formData.valid.rEmail);
    component.form.get('password').setValue(formData.valid.pass);
    component.form.get('repeat_password').setValue(formData.valid.pass);
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
      component.form.get('repeat_email').setValue('');
      component.form.get('password').setValue('');
      component.form.get('repeat_password').setValue('');
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be invalid when email field are not a valid email', async () => {
      component.form.get('email').setValue(formData.invalid.email);
      component.form.get('repeat_email').setValue(formData.invalid.email);
      component.form.get('password').setValue(formData.valid.pass);
      component.form.get('repeat_password').setValue(formData.valid.pass);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be invalid when passwords not match', async () => {
      component.form.get('email').setValue(formData.valid.email);
      component.form.get('repeat_email').setValue(formData.valid.rEmail);
      component.form.get('password').setValue(formData.valid.pass);
      component.form.get('repeat_password').setValue(formData.invalid.pass);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be invalid when emails not match', async () => {
      component.form.get('email').setValue(formData.valid.email);
      component.form
        .get('repeat_email')
        .setValue('ups' + formData.valid.rEmail);
      component.form.get('password').setValue(formData.valid.pass);
      component.form.get('repeat_password').setValue(formData.invalid.pass);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be invalid when passwords are not valid', async () => {
      component.form.get('email').setValue(formData.valid.email);
      component.form.get('password').setValue(formData.invalid.pass);
      component.form.get('repeat_password').setValue(formData.invalid.pass);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be valid', async () => {
      component.form.get('email').setValue(formData.valid.email);
      component.form.get('repeat_email').setValue(formData.valid.rEmail);
      component.form.get('password').setValue(formData.valid.pass);
      component.form.get('repeat_password').setValue(formData.valid.pass);
      expect(component.form.valid).toBeTruthy();
    });
  });
});
