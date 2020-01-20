import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxInputComponent } from './ux-input.component';
import { FormGroupDirective } from '@angular/forms';

describe('UxInputComponent', () => {
  let component: UxInputComponent;
  let fixture: ComponentFixture<UxInputComponent>;
  let formGroupDirectiveMock: any;
  beforeEach(async(() => {
    formGroupDirectiveMock = { control: { get: () => null} };
    TestBed.configureTestingModule({
      declarations: [ UxInputComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
