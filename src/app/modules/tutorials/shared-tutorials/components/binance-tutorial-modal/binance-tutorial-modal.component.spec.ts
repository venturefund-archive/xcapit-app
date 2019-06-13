import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceTutorialModalComponent } from './binance-tutorial-modal.component';
import { ModalController } from '@ionic/angular';

describe('BinanceTutorialModalComponent', () => {
  let component: BinanceTutorialModalComponent;
  let fixture: ComponentFixture<BinanceTutorialModalComponent>;
  let modalControllerSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);
    TestBed.configureTestingModule({
      declarations: [ BinanceTutorialModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }
      ]
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
