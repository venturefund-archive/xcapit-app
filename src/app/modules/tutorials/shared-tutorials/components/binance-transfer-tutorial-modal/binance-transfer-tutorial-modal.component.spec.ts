import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceTransferTutorialModalComponent } from './binance-transfer-tutorial-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('BinanceTransferTutorialModalComponent', () => {
  let component: BinanceTransferTutorialModalComponent;
  let fixture: ComponentFixture<BinanceTransferTutorialModalComponent>;
  let modalControllerSpy: any;

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );
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
    modalControllerSpy = TestBed.inject(ModalController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Binance Address Tutorial', async (done) => {
    component.openBinanceAddress().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
    done();
  });
});
