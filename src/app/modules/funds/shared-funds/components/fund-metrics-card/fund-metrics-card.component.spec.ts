import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundMetricsCardComponent } from './fund-metrics-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '../../pipes/absolute-value/absolute-value.pipe';
import { StrategyNamePipe } from '../../pipes/strategy-name/strategy-name.pipe';

describe('FundMetricsCardComponent', () => {
  let component: FundMetricsCardComponent;
  let fixture: ComponentFixture<FundMetricsCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FundMetricsCardComponent, AbsoluteValuePipe, StrategyNamePipe],
        imports: [IonicModule, TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(FundMetricsCardComponent);
      component = fixture.componentInstance;
      component.resume = { fund_name: 'Test' };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
