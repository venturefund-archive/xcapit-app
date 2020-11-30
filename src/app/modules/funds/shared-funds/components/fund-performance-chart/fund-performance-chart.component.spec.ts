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

  it('should call createChart on changes', () => {
    const spy = spyOn(component, 'createChart');
    component.ngOnChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call createDataSet on createChart', () => {
    const spy = spyOn(component, 'createDataSet');
    spy.and.returnValue([{time: 1605883607, value: 3.14}])
    component.createChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call createLimitDataSet on createChart', () => {
    const spy = spyOn(component, 'createLimitDataSet');
    spy.and.returnValue([{time: 1605883607, value: 3.14}])
    component.createChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call setXAxisrange on createChart', () => {
    const spy = spyOn(component, 'setXAxisRange');
    component.createChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
