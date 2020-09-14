import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxTitleComponent } from './ux-title.component';

describe('UxTitleComponent', () => {
  let component: UxTitleComponent;
  let fixture: ComponentFixture<UxTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UxTitleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
