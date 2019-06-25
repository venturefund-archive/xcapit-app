import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveTutorialPage } from './interactive-tutorial.page';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

describe('InteractiveTutorialPage', () => {
  let component: InteractiveTutorialPage;
  let fixture: ComponentFixture<InteractiveTutorialPage>;
  let modalControllerSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);
    TestBed.configureTestingModule({
      declarations: [ InteractiveTutorialPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveTutorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalControllerSpy = TestBed.get(ModalController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Binance Trtansfer Tutorial', () => {
    component.openBinanceTransferTutorial().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });

  it('should open Binance Tutorial', () => {
    component.openBinanceTutorial().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });

  it('should open CA Tutorial', () => {
    component.openCaTutorial().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });
});
