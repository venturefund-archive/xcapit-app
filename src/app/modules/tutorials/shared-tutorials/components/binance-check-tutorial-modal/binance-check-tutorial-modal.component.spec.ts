import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceCheckTutorialModalComponent } from './binance-check-tutorial-modal.component';

describe('BinanceCheckTutorialModalComponent', () => {
  let component: BinanceCheckTutorialModalComponent;
  let fixture: ComponentFixture<BinanceCheckTutorialModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinanceCheckTutorialModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinanceCheckTutorialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
