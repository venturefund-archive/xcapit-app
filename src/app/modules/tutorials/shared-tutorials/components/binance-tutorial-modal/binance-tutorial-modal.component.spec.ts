import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceTutorialModalComponent } from './binance-tutorial-modal.component';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

describe('BinanceTutorialModalComponent', () => {
  let component: BinanceTutorialModalComponent;
  let fixture: ComponentFixture<BinanceTutorialModalComponent>;
  let modalControllerSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);
    TestBed.configureTestingModule({
      declarations: [ BinanceTutorialModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
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
    modalControllerSpy = TestBed.get(ModalController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Binance Check Tutorial', () => {
    component.openBinanceCheck().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });

  it('should close modal', () => {
    component.closeModal();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
