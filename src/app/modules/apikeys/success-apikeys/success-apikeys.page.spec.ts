import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessApikeysPage } from './success-apikeys.page';

describe('SuccessApikeysPage', () => {
  let component: SuccessApikeysPage;
  let fixture: ComponentFixture<SuccessApikeysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessApikeysPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessApikeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
