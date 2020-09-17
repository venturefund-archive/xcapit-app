import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundPerformanceChartComponent } from './fund-performance-chart.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FundPercentageEvolutionChartInterface } from '../performance-chart-card/fund-performance-chart.interface';
import * as Chart from 'chart.js';
import { LanguageService } from 'src/app/shared/services/language/language.service';

const fundPerformanceMock: FundPercentageEvolutionChartInterface = {
  timestamp: ['01/10/2019'],
  percentage_evolution: [0.2],
  stop_loss: -10,
  take_profit: 10,
};

class ChartMock {
  constructor() {}
  getDatasetMeta: () => null;
}
describe('FundPerformanceChartComponent', () => {
  let component: FundPerformanceChartComponent;
  let fixture: ComponentFixture<FundPerformanceChartComponent>;
  const languageServiceMock = {selected: 'en'};
  let translateServiceSpy: any;

  beforeEach(async(() => {
    translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'instant',
    ]);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [FundPerformanceChartComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        DatePipe,
        {
          provide: TranslateService,
          useValue: translateServiceSpy,
        },
        {
          provide: Chart,
          useClass: ChartMock,
        },
        {
          provide: LanguageService,
          useValue: languageServiceMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundPerformanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.fundPercentageEvolution = fundPerformanceMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setChart on changes', () => {
    const spy = spyOn(component, 'setChart');
    component.ngOnChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call scalesOptions on setChart', () => {
    const spy = spyOn(component, 'scalesOptions');
    component.setChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call layoutOptions on setChart', () => {
    const spy = spyOn(component, 'layoutOptions');
    component.setChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call setGradient on setChart', () => {
    const spy = spyOn(component, 'setGradient');
    component.setChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call normalizeLabels on setChart', () => {
    const spy = spyOn(component, 'normalizeLabels');
    component.setChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call hasPerformanceData on setChart', () => {
    const spy = spyOn(component, 'hasPerformanceData');
    component.setChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getTakeProfitDataset on getDatasets when TP is 5', () => {
    component.fundPercentageEvolution.take_profit = 5;
    fixture.detectChanges();
    const spy = spyOn(component, 'getTakeProfitDataset');
    component.getDatasets();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getStopLossDataset on getDatasets when SL is 5', () => {
    component.fundPercentageEvolution.stop_loss = 5;
    fixture.detectChanges();
    const spy = spyOn(component, 'getStopLossDataset');
    component.getDatasets();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call getTakeProfitDataset on getDatasets when TP is 10 and last percentage is 4', () => {
    component.fundPercentageEvolution.take_profit = 10;
    component.fundPercentageEvolution.percentage_evolution = [4];
    fixture.detectChanges();
    const spy = spyOn(component, 'getTakeProfitDataset');
    component.getDatasets();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should not call getStopLossDataset on getDatasets when SL is -10 and last percentage is -4', () => {
    component.fundPercentageEvolution.stop_loss = 10;
    component.fundPercentageEvolution.percentage_evolution = [-4];
    fixture.detectChanges();
    const spy = spyOn(component, 'getStopLossDataset');
    component.getDatasets();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should return correct point data on setStopLossPointData is called', () => {
    component.fundPercentageEvolution.stop_loss = 10;
    component.fundPercentageEvolution.percentage_evolution = [2, -7];
    fixture.detectChanges();
    const returnValue = component.setStopLossPointData();
    expect(returnValue).toEqual([null, -10]);
  });

  it('should return correct point data on setTakeProfitPointData is called', () => {
    component.fundPercentageEvolution.take_profit = 10;
    component.fundPercentageEvolution.percentage_evolution = [2, 7];
    fixture.detectChanges();
    const returnValue = component.setTakeProfitPointData();
    expect(returnValue).toEqual([null, 10]);
  });
});
