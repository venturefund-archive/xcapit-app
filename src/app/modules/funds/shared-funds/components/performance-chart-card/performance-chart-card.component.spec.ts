import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PerformanceChartCardComponent } from './performance-chart-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PerformanceChartCardComponent', () => {
  let component: PerformanceChartCardComponent;
  let fixture: ComponentFixture<PerformanceChartCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PerformanceChartCardComponent],
        imports: [IonicModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(PerformanceChartCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
