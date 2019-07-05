import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FundPerformanceChartComponent } from './components/fund-performance-chart/fund-performance-chart.component';
import { DatePipe } from '@angular/common';
import { CurrencyPercentagePipe } from './pipes/currency-percentage/currency-percentage.pipe';

@NgModule({
  declarations: [FundPerformanceChartComponent, CurrencyPercentagePipe],
  providers: [DatePipe],
  imports: [SharedModule],
  exports: [SharedModule, FundPerformanceChartComponent, CurrencyPercentagePipe]
})
export class SharedFundsModule {}
