import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundRiskPage } from './fund-risk.page';

describe('FundRiskPage', () => {
  let component: FundRiskPage;
  let fixture: ComponentFixture<FundRiskPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundRiskPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundRiskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
