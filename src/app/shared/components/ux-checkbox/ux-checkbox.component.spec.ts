import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxCheckboxComponent } from './ux-checkbox.component';
import { FormGroupDirective } from '@angular/forms';

describe('UxCheckboxComponent', () => {
  let component: UxCheckboxComponent;
  let fixture: ComponentFixture<UxCheckboxComponent>;
  let formGroupDirectiveMock: any;
  beforeEach(async(() => {
    formGroupDirectiveMock = { control: { get: () => null} };
    TestBed.configureTestingModule({
      declarations: [ UxCheckboxComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
