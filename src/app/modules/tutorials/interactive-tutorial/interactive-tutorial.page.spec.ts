import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveTutorialPage } from './interactive-tutorial.page';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { of } from 'rxjs';

describe('InteractiveTutorialPage', () => {
  let component: InteractiveTutorialPage;
  let fixture: ComponentFixture<InteractiveTutorialPage>;
  let modalControllerSpy: any;
  let logsServiceMock: any;

  beforeEach(async(() => {
    logsServiceMock = {
      log: () => of({})
    };
    modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'create',
      'dismiss'
    ]);
    TestBed.configureTestingModule({
      declarations: [InteractiveTutorialPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: LogsService, useValue: logsServiceMock },
        { provide: ModalController, useValue: modalControllerSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveTutorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalControllerSpy = TestBed.get(ModalController);
    logsServiceMock = TestBed.get(LogsService);
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

  it('should call log on ngOnInit', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on openCaTutorial', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.openCaTutorial();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on openBinanceTutorial', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.openBinanceTutorial();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on openBinanceTransferTutorial', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.openBinanceTransferTutorial();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
