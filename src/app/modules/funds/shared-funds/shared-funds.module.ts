import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CurrencyPercentagePipe } from './pipes/currency-percentage/currency-percentage.pipe';
import { CurrencyTextPipe } from './pipes/currency-text/currency-text.pipe';
import { FundPerformanceChartComponent } from './components/fund-performance-chart/fund-performance-chart.component';
import { CurrencyAmountValueComponent } from './components/currency-amount-value/currency-amount-value.component';
import { CommissionNamePipe } from './pipes/commission-name/commission-name.pipe';
import { CommissionsContentComponent } from './components/commissions-content/commissions-content.component';
import { CustomRangeModalComponent } from './components/custom-range-modal/custom-range-modal.component';
import { AbsoluteValuePipe } from './pipes/absolute-value/absolute-value.pipe';
import { FundCardComponent } from './components/fund-card/fund-card.component';
import { FundSummaryCardComponent } from './components/fund-summary-card/fund-summary-card.component';
import { PerformanceChartCardComponent } from './components/performance-chart-card/performance-chart-card.component';
import { FundMetricsCardComponent } from './components/fund-metrics-card/fund-metrics-card.component';
import { FundPortfolioCardComponent } from './components/fund-portfolio-card/fund-portfolio-card.component';
import { FundOperationsHistoryComponent } from './components/fund-operations-history/fund-operations-history.component';
import { FundBalanceChartComponent } from './components/fund-balance-chart/fund-balance-chart.component';
import { FundBalanceDetailComponent } from './components/fund-balance-detail/fund-balance-detail.component';
import { FundBalanceDetailItemComponent } from './components/fund-balance-detail-item/fund-balance-detail-item.component';
import { FundFinishComponent } from './components/fund-finish/fund-finish.component';
import { CurrencyFormatPipe } from './pipes/currency-format/currency-format.pipe';
import { FundStopLossComponent } from './components/fund-stop-loss/fund-stop-loss.component';
import { FundTakeProfitComponent } from './components/fund-take-profit/fund-take-profit.component';
import { FundShareChartComponent } from './components/fund-share-chart/fund-share-chart.component';
import { FundTimelineComponent } from './components/fund-timeline/fund-timeline.component';
import { InvestmentProductCardComponent } from './components/investment-product-card/investment-product-card.component';
import { HideTextPipe } from 'src/app/shared/pipes/hide-text/hide-text.pipe';
import { StrategyNamePipe } from './pipes/strategy-name/strategy-name.pipe';
import { NoApikeysModalComponent } from './components/no-apikeys-modal/no-apikeys-modal.component';
import { CustomStopLossSettingComponent } from './components/custom-stop-loss-setting/custom-stop-loss-setting.component';

@NgModule({
  declarations: [
    FundPerformanceChartComponent,
    CurrencyPercentagePipe,
    CurrencyTextPipe,
    CurrencyAmountValueComponent,
    CommissionNamePipe,
    CommissionsContentComponent,
    CustomRangeModalComponent,
    CustomStopLossSettingComponent,
    AbsoluteValuePipe,
    FundCardComponent,
    FundSummaryCardComponent,
    PerformanceChartCardComponent,
    FundMetricsCardComponent,
    FundPortfolioCardComponent,
    FundOperationsHistoryComponent,
    FundBalanceChartComponent,
    FundBalanceDetailComponent,
    FundBalanceDetailItemComponent,
    FundStopLossComponent,
    FundTakeProfitComponent,
    FundFinishComponent,
    FundShareChartComponent,
    FundTimelineComponent,
    InvestmentProductCardComponent,
    CurrencyFormatPipe,
    HideTextPipe,
    StrategyNamePipe,
    NoApikeysModalComponent,
  ],
  providers: [DatePipe, DecimalPipe, HideTextPipe],
  imports: [SharedModule],
  exports: [
    SharedModule,
    FundPerformanceChartComponent,
    CurrencyPercentagePipe,
    CurrencyTextPipe,
    CurrencyAmountValueComponent,
    CommissionNamePipe,
    NoApikeysModalComponent,
    CommissionsContentComponent,
    CustomRangeModalComponent,
    CustomStopLossSettingComponent,
    AbsoluteValuePipe,
    FundCardComponent,
    FundSummaryCardComponent,
    PerformanceChartCardComponent,
    FundMetricsCardComponent,
    FundPortfolioCardComponent,
    FundOperationsHistoryComponent,
    FundBalanceChartComponent,
    FundBalanceDetailComponent,
    FundBalanceDetailItemComponent,
    FundFinishComponent,
    FundStopLossComponent,
    FundTakeProfitComponent,
    FundShareChartComponent,
    FundTimelineComponent,
    InvestmentProductCardComponent,
    CurrencyFormatPipe,
    HideTextPipe,
    StrategyNamePipe,
  ],
  entryComponents: [CustomRangeModalComponent, FundBalanceDetailComponent],
})
export class SharedFundsModule {}
