import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RunPerformanceChartComponent } from './components/run-performance-chart/run-performance-chart.component';
import { SharedFundsModule } from '../../funds/shared-funds/shared-funds.module';

@NgModule({
  declarations: [
    RunPerformanceChartComponent
  ],
  imports: [
    SharedModule,
    SharedFundsModule
  ],
  providers: [DatePipe],
  exports: [
    SharedModule,
    SharedFundsModule,
    RunPerformanceChartComponent
  ]
})
export class SharedRunsModule { }
