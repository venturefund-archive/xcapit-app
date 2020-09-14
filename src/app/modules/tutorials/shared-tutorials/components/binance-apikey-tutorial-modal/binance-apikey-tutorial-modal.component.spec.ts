import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceApikeyTutorialModalComponent } from './binance-apikey-tutorial-modal.component';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('BinanceApikeyTutorialModalComponent', () => {
  let component: BinanceApikeyTutorialModalComponent;
  let fixture: ComponentFixture<BinanceApikeyTutorialModalComponent>;
  let modalControllerSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );
    TestBed.configureTestingModule({
      declarations: [BinanceApikeyTutorialModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinanceApikeyTutorialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
