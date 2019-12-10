import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XcapitHeaderTramaComponent } from './xcapit-header-trama.component';

describe('XcapitHeaderTramaComponent', () => {
  let component: XcapitHeaderTramaComponent;
  let fixture: ComponentFixture<XcapitHeaderTramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XcapitHeaderTramaComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XcapitHeaderTramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
