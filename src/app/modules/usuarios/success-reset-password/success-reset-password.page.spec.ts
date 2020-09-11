import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute } from '@angular/router';

import { SuccessResetPasswordPage } from './success-reset-password.page';

describe('SuccessResetPasswordPage', () => {
  let component: SuccessResetPasswordPage;
  let fixture: ComponentFixture<SuccessResetPasswordPage>;

  beforeEach(async(() => {
    let activatedRouteSpy: any;

    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        isReset: 'false'
      })
    };
    TestBed.configureTestingModule({
      declarations: [ SuccessResetPasswordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessResetPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
