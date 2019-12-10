import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XcapitInputComponent } from './xcapit-input.component';

describe('XcapitInputComponent', () => {
  let component: XcapitInputComponent;
  let fixture: ComponentFixture<XcapitInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XcapitInputComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XcapitInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
