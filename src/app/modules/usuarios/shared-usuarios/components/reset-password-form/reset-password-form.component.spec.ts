import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordFormComponent } from './reset-password-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';

fdescribe('ResetPasswordFormComponent', () => {
  let component: ResetPasswordFormComponent;
  let fixture: ComponentFixture<ResetPasswordFormComponent>;
  const formData = {
    validNoEmail: {
      password: 'asdfF1',
      repeat_password: 'asdfF1'
    },
    validNoPassword: {
      email: 'email@email.com',
    },
    invalid: {
      email: 'fdaas',
      password: 'dsfaaa',
      repeat_password: 'dsfaa'
    },
    empty: {
      email: '',
      password: '',
      repeat_password: ''
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, IonicModule],
      declarations: [ResetPasswordFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordFormComponent);
    component = fixture.componentInstance;
    component.form.enable();
    component.form.patchValue(formData.empty);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call send event when isReset is true and form valid on form submit', () => {
    console.log(component.form);
    const spy = spyOn(component.send, 'emit').and.returnValue(null);
    component.isReset = true;
    component.initForm();
    console.log(component.form);
    component.form.patchValue(formData.validNoEmail);
    fixture.detectChanges();
    console.log(component.form);
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call send event when isReset is false and form valid on form submit', () => {
    const spy = spyOn(component.send, 'emit').and.returnValue(null);
    component.isReset = false;
    component.initForm();
    component.form.patchValue(formData.validNoPassword);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call send event when isReset is false and form invalid', () => {
    const spy = spyOn(component.send, 'emit').and.returnValue(null);
    component.isReset = false;
    component.initForm();
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(0);
  });



  it('should not call send event when isReset is true and form invalid', () => {
    const spy = spyOn(component.send, 'emit').and.returnValue(null);
    component.isReset = true;
    component.initForm();
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
