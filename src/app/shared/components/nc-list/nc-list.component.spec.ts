import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcListComponent } from './nc-list.component';

describe('NcListComponent', () => {
  let component: NcListComponent;
  let fixture: ComponentFixture<NcListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
