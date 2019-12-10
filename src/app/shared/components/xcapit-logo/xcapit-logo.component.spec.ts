import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { XcapitLogoComponent } from './xcapit-logo.component';

describe('LogoXcapitComponent', () => {
  let component: XcapitLogoComponent;
  let fixture: ComponentFixture<XcapitLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [XcapitLogoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XcapitLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
