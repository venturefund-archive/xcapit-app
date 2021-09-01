import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RunPerformanceChartComponent } from './run-performance-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

const runPerformance = {
  wcs_advisor: [10, 10.1, 11],
  performance_btc: [1, 2, 3],
  performance_usdt: [1, 2, 3],
  index: ['2020-03-20', '2020-03-21', '2020-03-22'],
};

describe('RunPerformanceChartComponent', () => {
  let component: RunPerformanceChartComponent;
  let fixture: ComponentFixture<RunPerformanceChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [RunPerformanceChartComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [DatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunPerformanceChartComponent);
    component = fixture.componentInstance;
    component.runPerformance = runPerformance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create chart on changes and currency is BTC', () => {
    component.currency = 'BTC';
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.chart).toBeTruthy();
  });

  it('should create chart on changes and currency is USDT', () => {
    component.currency = 'USDT';
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.chart).toBeTruthy();
  });

  it('should not create chart on changes', () => {
    component.currency = 'USDT';
    component.runPerformance = null;
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.chart).toBeUndefined();
  });
});
