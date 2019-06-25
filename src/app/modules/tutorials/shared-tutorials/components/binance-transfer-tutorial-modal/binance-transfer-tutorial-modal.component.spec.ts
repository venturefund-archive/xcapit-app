import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceTransferTutorialModalComponent } from './binance-transfer-tutorial-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';

describe('BinanceTransferTutorialModalComponent', () => {
  let component: BinanceTransferTutorialModalComponent;
  let fixture: ComponentFixture<BinanceTransferTutorialModalComponent>;
  let modalControllerSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);
    TestBed.configureTestingModule({
      declarations: [ BinanceTransferTutorialModalComponent ],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinanceTransferTutorialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalControllerSpy = TestBed.get(ModalController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Binance Address Tutorial', () => {
    component.openBinanceAddress().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });
});
