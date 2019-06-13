import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceAddressTutorialModalComponent } from './binance-address-tutorial-modal.component';

describe('BinanceAddressTutorialModalComponent', () => {
  let component: BinanceAddressTutorialModalComponent;
  let fixture: ComponentFixture<BinanceAddressTutorialModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinanceAddressTutorialModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinanceAddressTutorialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
