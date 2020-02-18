import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTakeProfitPage } from './fund-take-profit.page';

describe('FundTakeProfitPage', () => {
  let component: FundTakeProfitPage;
  let fixture: ComponentFixture<FundTakeProfitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundTakeProfitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundTakeProfitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
