import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundMetricsCardComponent } from './fund-metrics-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { FundMetricsInterface } from './fund-metrics.interface';
const testMetrics: FundMetricsInterface = {
  cumulative_return: 40,
  longest_drawdown: 30,
  max_drawdown: 20,
  sharpe: 10
};

describe('FundMetricsCardComponent', () => {
  let component: FundMetricsCardComponent;
  let fixture: ComponentFixture<FundMetricsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FundMetricsCardComponent],
      imports: [IonicModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FundMetricsCardComponent);
    component = fixture.componentInstance;
    component.metrics = testMetrics;
    component.currency = 'BTC';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
