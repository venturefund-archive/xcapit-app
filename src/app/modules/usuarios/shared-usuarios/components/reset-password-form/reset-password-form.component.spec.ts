import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordFormComponent } from './reset-password-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';

describe('ResetPasswordFormComponent', () => {
  let component: ResetPasswordFormComponent;
  let fixture: ComponentFixture<ResetPasswordFormComponent>;
  const formData = {
    valid: {
      email: 'email@email.com',
      password: 'asdfF1',
      repeat_password: 'asdfF1'
    },
    invalid: {
      email: 'fdaas',
      password: 'dsfaaa',
      repeat_password: 'dsfaa'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, IonicModule],
      declarations: [ResetPasswordFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleSubmit on submit event, valid form', () => {
    component.form.patchValue(formData.valid);
    const spy = spyOn(component, 'handleSubmit');
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('form'))
      .triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call emit on send, valid form, isReset false', () => {
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const spy = spyOn(component.send, 'emit');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call emit on send, valid form, isReset true', () => {
    const spy = spyOn(component.send, 'emit');
    component.isReset = true;
    component.initForm();
    component.form.get('password').setValue(formData.valid.password);
    component.form
      .get('repeat_password')
      .setValue(formData.valid.repeat_password);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.handleSubmit();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call emit on send, valid form', () => {
    const spy = spyOn(component.send, 'emit');
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
