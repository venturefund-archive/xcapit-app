import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundPerformanceChartComponent } from './fund-performance-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

describe('FundPerformanceChartComponent', () => {
  let component: FundPerformanceChartComponent;
  let fixture: ComponentFixture<FundPerformanceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ FundPerformanceChartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundPerformanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
