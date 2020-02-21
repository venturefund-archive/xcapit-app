import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxRangeComponent } from './ux-range.component';

describe('UxRangeComponent', () => {
  let component: UxRangeComponent;
  let fixture: ComponentFixture<UxRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UxRangeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
