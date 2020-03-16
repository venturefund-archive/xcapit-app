import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxRangeComponent } from './ux-range.component';
import { FormGroupDirective } from '@angular/forms';

describe('UxRangeComponent', () => {
  let component: UxRangeComponent;
  let fixture: ComponentFixture<UxRangeComponent>;
  let formGroupDirectiveMock: any;

  beforeEach(async(() => {
    formGroupDirectiveMock = { control: { get: () => null } };

    TestBed.configureTestingModule({
      declarations: [UxRangeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
