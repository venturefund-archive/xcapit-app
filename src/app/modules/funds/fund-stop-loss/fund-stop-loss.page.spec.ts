import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundStopLossPage } from './fund-stop-loss.page';

describe('FundStopLossPage', () => {
  let component: FundStopLossPage;
  let fixture: ComponentFixture<FundStopLossPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundStopLossPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundStopLossPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
