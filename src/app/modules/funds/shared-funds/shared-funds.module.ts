import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FundPerformanceChartComponent } from './components/fund-performance-chart/fund-performance-chart.component';
import { DatePipe } from '@angular/common';
import { CurrencyPercentagePipe } from './pipes/currency-percentage/currency-percentage.pipe';
import { CurrencyTextPipe } from './pipes/currency-text/currency-text.pipe';

@NgModule({
  declarations: [
    FundPerformanceChartComponent,
    CurrencyPercentagePipe,
    CurrencyTextPipe
  ],
  providers: [DatePipe],
  imports: [SharedModule],
  exports: [
    SharedModule,
    FundPerformanceChartComponent,
    CurrencyPercentagePipe,
    CurrencyTextPipe
  ]
})
export class SharedFundsModule {}
