import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FundBalanceChartComponent } from './fund-balance-chart.component';

describe('FundBalanceChartComponent', () => {
  let component: FundBalanceChartComponent;
  let fixture: ComponentFixture<FundBalanceChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundBalanceChartComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundBalanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create chart on changes and fundBalance exists', () => {
    component.fundBalance = [{ color: 'red', percentage: 50, ca: 'ETH' }];
    component.ngOnChanges();
    expect(component.colors).toEqual(['red']);
    expect(component.data).toEqual([50]);
    expect(component.labels).toEqual(['ETH']);
    expect(component.chart).toBeTruthy();
  });

  it('should not create chart on changes and fund balance not exists', () => {
    component.fundBalance = null;
    component.ngOnChanges();
    expect(component.colors).toEqual([]);
    expect(component.data).toEqual([]);
    expect(component.labels).toEqual([]);
  });
});
