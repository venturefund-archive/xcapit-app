import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceTutorialModalComponent } from './binance-tutorial-modal.component';

describe('BinanceTutorialModalComponent', () => {
  let component: BinanceTutorialModalComponent;
  let fixture: ComponentFixture<BinanceTutorialModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinanceTutorialModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinanceTutorialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
