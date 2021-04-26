import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxTextareaComponent } from './ux-textarea.component';
import { FormGroupDirective } from '@angular/forms';

describe('UxTextareaComponent', () => {
  let component: UxTextareaComponent;
  let fixture: ComponentFixture<UxTextareaComponent>;
  let formGroupDirectiveMock: any;
  beforeEach(
    waitForAsync(() => {
      formGroupDirectiveMock = { control: { get: () => null } };
      TestBed.configureTestingModule({
        declarations: [UxTextareaComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UxTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
