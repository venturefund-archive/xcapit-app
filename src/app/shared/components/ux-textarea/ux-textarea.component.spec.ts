import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxTextareaComponent } from './ux-textarea.component';
import { FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('UxTextareaComponent', () => {
  let component: UxTextareaComponent;
  let fixture: ComponentFixture<UxTextareaComponent>;
  let formGroupDirectiveMock: any;
  beforeEach(waitForAsync(() => {
    formGroupDirectiveMock = { control: { get: () => null } };
    TestBed.configureTestingModule({
      declarations: [UxTextareaComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show old validator errors by default', () => {
    const el = fixture.debugElement.query(By.css('app-errors-form-item'));
    expect(el).toBeTruthy();
  });

  it('should show new validator errors if useNewErrors is true', () => {
    component.useNewErrors = true;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('app-errors-form-password-item'));
    expect(el).toBeTruthy();
  });
});
