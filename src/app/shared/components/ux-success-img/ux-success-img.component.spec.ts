import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxSuccessImgComponent } from './ux-success-img.component';

describe('UxSuccessImgComponent', () => {
  let component: UxSuccessImgComponent;
  let fixture: ComponentFixture<UxSuccessImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UxSuccessImgComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxSuccessImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
