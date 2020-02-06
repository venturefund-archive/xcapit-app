import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxDropDownSelectComponent } from './ux-drop-down-select.component';
import { TranslateModule } from '@ngx-translate/core';

describe('UxDropDownSelectComponent', () => {
  let component: UxDropDownSelectComponent;
  let fixture: ComponentFixture<UxDropDownSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UxDropDownSelectComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxDropDownSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
