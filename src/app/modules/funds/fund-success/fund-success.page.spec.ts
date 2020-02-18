import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSuccessPage } from './fund-success.page';

describe('FundSuccessPage', () => {
  let component: FundSuccessPage;
  let fixture: ComponentFixture<FundSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundSuccessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
