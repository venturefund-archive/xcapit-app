import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxInputGooglePlacesComponent } from './ux-input-google-places.component';
import { FormGroupDirective } from '@angular/forms';

describe('UxInputGooglePlacesComponent', () => {
  let component: UxInputGooglePlacesComponent;
  let fixture: ComponentFixture<UxInputGooglePlacesComponent>;
  let formGroupDirectiveMock: any;
  beforeEach(async(() => {
    formGroupDirectiveMock = { control: { get: () => null } };
    TestBed.configureTestingModule({
      declarations: [UxInputGooglePlacesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxInputGooglePlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
