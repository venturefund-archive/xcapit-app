import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceCheckTutorialModalComponent } from './binance-check-tutorial-modal.component';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('BinanceCheckTutorialModalComponent', () => {
  let component: BinanceCheckTutorialModalComponent;
  let fixture: ComponentFixture<BinanceCheckTutorialModalComponent>;
  let modalControllerSpy: any;

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );
    TestBed.configureTestingModule({
      declarations: [ BinanceCheckTutorialModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }
      ]
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
