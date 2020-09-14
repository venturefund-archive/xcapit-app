import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessProfilePage } from './success-profile.page';

describe('SuccessProfilePage', () => {
  let component: SuccessProfilePage;
  let fixture: ComponentFixture<SuccessProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
