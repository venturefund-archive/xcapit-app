import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDurationPage } from './fund-duration.page';

describe('FundDurationPage', () => {
  let component: FundDurationPage;
  let fixture: ComponentFixture<FundDurationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundDurationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundDurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
