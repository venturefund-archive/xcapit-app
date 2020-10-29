import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute } from '@angular/router';

import { FundSuccessPage } from './fund-success.page';

describe('FundSuccessPage', () => {
  let component: FundSuccessPage;
  let fixture: ComponentFixture<FundSuccessPage>;

  beforeEach(async(() => {
    let activatedRouteSpy: any;

    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        isRenew: 'true'
      })
    };
    TestBed.configureTestingModule({
      declarations: [ FundSuccessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
