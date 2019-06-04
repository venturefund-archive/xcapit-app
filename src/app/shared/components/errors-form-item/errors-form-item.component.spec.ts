import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsFormItemComponent } from './errors-form-item.component';
import { FormGroupDirective } from '@angular/forms';

describe('ErrorsFormItemComponent', () => {
  let component: ErrorsFormItemComponent;
  let fixture: ComponentFixture<ErrorsFormItemComponent>;
  let formGroupDirectiveMock: any;

  beforeEach(async(() => {
    formGroupDirectiveMock = { control: { get: () => null } };

    TestBed.configureTestingModule({
      declarations: [ ErrorsFormItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
