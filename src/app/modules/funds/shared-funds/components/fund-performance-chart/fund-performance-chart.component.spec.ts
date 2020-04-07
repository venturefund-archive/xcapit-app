import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundPerformanceChartComponent } from './fund-performance-chart.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { translateServiceSpy } from 'src/testing/spies/translate-service-spy.spec';
import { FundPerformanceChartInterface } from '../performance-chart-card/fund-performance-chart.interface';
import * as Chart from 'chart.js';
const fundPerformanceMock: FundPerformanceChartInterface = {
  dates: ['01/10/2019'],
  performance: [0.2],
  stop_loss: -0.1,
  take_profit: 0.2,
};

class ChartMock {
  constructor() {}
}
describe('FundPerformanceChartComponent', () => {
  let component: FundPerformanceChartComponent;
  let fixture: ComponentFixture<FundPerformanceChartComponent>;
  beforeEach(async(() => {
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
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundPerformanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.fundPerformance = fundPerformanceMock;
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

  it('should call setStopLossData on setChart', () => {
    const spy = spyOn(component, 'setStopLossData');
    component.setChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call setTakeProfitData on setChart', () => {
    const spy = spyOn(component, 'setTakeProfitData');
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
});
