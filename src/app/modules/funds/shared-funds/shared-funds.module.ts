import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatePipe } from '@angular/common';
import { CurrencyPercentagePipe } from './pipes/currency-percentage/currency-percentage.pipe';
import { CurrencyTextPipe } from './pipes/currency-text/currency-text.pipe';
import { FundPerformanceChartComponent } from './components/fund-performance-chart/fund-performance-chart.component';
import { StateShowNamePipe } from './pipes/state-names/state-names.pipe';
import { CurrencyAmountValueComponent } from './components/currency-amount-value/currency-amount-value.component';
import { CommissionNamePipe } from './pipes/commission-name/commission-name.pipe';

@NgModule({
  declarations: [
    FundPerformanceChartComponent,
    CurrencyPercentagePipe,
    CurrencyTextPipe,
    StateShowNamePipe,
    CurrencyAmountValueComponent,
    CommissionNamePipe
  ],
  providers: [DatePipe],
  imports: [SharedModule],
  exports: [
    SharedModule,
    FundPerformanceChartComponent,
    CurrencyPercentagePipe,
    CurrencyTextPipe,
    StateShowNamePipe,
    CurrencyAmountValueComponent,
    CommissionNamePipe
  ]
})
export class SharedFundsModule {}
