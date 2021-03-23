import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordChangeFormComponent } from './password-change-form.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('PasswordChangeFormComponent', () => {
  let component: PasswordChangeFormComponent;
  let fixture: ComponentFixture<PasswordChangeFormComponent>;
  const formData = {
    valid: {
      actual_password: 'asdf',
      password: 'asdfF1',
      repeat_password: 'asdfF1'
    },
    invalid: {
      actual_password: 'fdaas',
      password: 'dsfaaa',
      repeat_password: 'dsfaa'
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordChangeFormComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, IonicModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordChangeFormComponent);
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

  it('should call emit on send, valid form', () => {
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const spy = spyOn(component.send, 'emit');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call emit on send, no valid form', () => {
    const spy = spyOn(component.send, 'emit');
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
