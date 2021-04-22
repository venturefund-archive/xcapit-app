import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunPerformanceChartComponent } from './run-performance-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

describe('RunPerformanceChartComponent', () => {
  let component: RunPerformanceChartComponent;
  let fixture: ComponentFixture<RunPerformanceChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ RunPerformanceChartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunPerformanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
