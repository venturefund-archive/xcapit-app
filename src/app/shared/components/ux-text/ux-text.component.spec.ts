import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxTextComponent } from './ux-text.component';

describe('UxTextComponent', () => {
  let component: UxTextComponent;
  let fixture: ComponentFixture<UxTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UxTextComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
