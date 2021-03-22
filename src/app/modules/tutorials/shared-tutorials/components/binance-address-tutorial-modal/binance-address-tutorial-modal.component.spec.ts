import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceAddressTutorialModalComponent } from './binance-address-tutorial-modal.component';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('BinanceAddressTutorialModalComponent', () => {
  let component: BinanceAddressTutorialModalComponent;
  let fixture: ComponentFixture<BinanceAddressTutorialModalComponent>;
  let modalControllerSpy: any;

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );
    TestBed.configureTestingModule({
      declarations: [BinanceAddressTutorialModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }]
    }).compileComponents();
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
