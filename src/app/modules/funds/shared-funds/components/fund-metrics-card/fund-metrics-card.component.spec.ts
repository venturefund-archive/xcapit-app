import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundMetricsCardComponent } from './fund-metrics-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '../../pipes/absolute-value/absolute-value.pipe';
import { StrategyNamePipe } from '../../pipes/strategy-name/strategy-name.pipe';
import { By } from '@angular/platform-browser';

const fundInfoManual = {
  perdida: 100,
  ganancia: 5000,
};
const fundInfo = {
  perdida: 10,
  ganancia: 20,
};
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
  it('should render manual stop loss code and take_profit code if the stop loss is manual and take profit is manual', () => {
    component.settings = fundInfoManual;
    fixture.detectChanges();
    const stopLossEl = fixture.debugElement.query(By.css('.fmc__stop_loss .item__value'));
    expect(stopLossEl.nativeElement.innerHTML).toContain('shared.without_SL_TP.without_stop_loss');
    const takeProfitEl = fixture.debugElement.query(By.css('.fmc__take_profit .item__value'));
    expect(takeProfitEl.nativeElement.innerHTML).toContain('shared.without_SL_TP.without_take_profit');
  });

  it('should render manual stop loss code and take_profit code if the stop loss and take profit are different than manual', () => {
    component.settings = fundInfo;
    fixture.detectChanges();
    const stopLossEl = fixture.debugElement.query(By.css('.fmc__stop_loss .item__value'));
    expect(stopLossEl.nativeElement.innerHTML).toContain('10%');
    const takeProfitEl = fixture.debugElement.query(By.css('.fmc__take_profit .item__value'));
    expect(takeProfitEl.nativeElement.innerHTML).toContain('20%');
  });
});
