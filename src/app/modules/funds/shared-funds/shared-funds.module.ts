import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FundPerformanceChartComponent } from './components/fund-performance-chart/fund-performance-chart.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [FundPerformanceChartComponent],
  providers: [DatePipe],
  imports: [SharedModule],
  exports: [SharedModule, FundPerformanceChartComponent]
})
export class SharedFundsModule {}
