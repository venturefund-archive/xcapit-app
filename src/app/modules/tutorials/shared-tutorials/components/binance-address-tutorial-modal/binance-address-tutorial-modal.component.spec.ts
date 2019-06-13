import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceAddressTutorialModalComponent } from './binance-address-tutorial-modal.component';
import { ModalController } from '@ionic/angular';

describe('BinanceAddressTutorialModalComponent', () => {
  let component: BinanceAddressTutorialModalComponent;
  let fixture: ComponentFixture<BinanceAddressTutorialModalComponent>;
  let modalControllerSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);
    TestBed.configureTestingModule({
      declarations: [ BinanceAddressTutorialModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }
      ]
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
