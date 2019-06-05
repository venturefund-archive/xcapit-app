import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsFormItemComponent } from './errors-form-item.component';
import { FormGroupDirective } from '@angular/forms';
import { ItemFormError } from '../../models/item-form-error';

describe('ErrorsFormItemComponent', () => {
  let component: ErrorsFormItemComponent;
  let fixture: ComponentFixture<ErrorsFormItemComponent>;
  let formGroupDirectiveMock: any;

  beforeEach(async(() => {
    formGroupDirectiveMock = { control: { get: () => null} };

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

  it('should set errors', () => {
    const errors: ItemFormError[] = [
      {
        name: 'minlength',
        text: 'Se requieren mínimo 6 caracteres',
        rules: []
      }
    ];
    component.errors = [...errors];
    component.ngOnInit();
    expect(component.errors.length).toBeGreaterThan(1);
  });

  it('should invalid prop have a false value when control is null', () => {
    expect(component.control).toBeFalsy();
    expect(component.invalid).toBeFalsy();
  });

  it('should valid prop have a false value when control is null', () => {
    expect(component.control).toBeFalsy();
    expect(component.valid).toBeFalsy();
  });
});
