import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UxCenterImgComponent } from './ux-center-img.component';

describe('UxCenterImgComponent', () => {
  let component: UxCenterImgComponent;
  let fixture: ComponentFixture<UxCenterImgComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UxCenterImgComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UxCenterImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render image in div', () => {
    const subheader = fixture.debugElement.query(By.css('img'));
    expect(subheader).not.toBeNull();
  });
});
