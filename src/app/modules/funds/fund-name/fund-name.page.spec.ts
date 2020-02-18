import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundNamePage } from './fund-name.page';

describe('FundNamePage', () => {
  let component: FundNamePage;
  let fixture: ComponentFixture<FundNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundNamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
