import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatePipe } from '@angular/common';
import { CurrencyPercentagePipe } from './pipes/currency-percentage/currency-percentage.pipe';
import { CurrencyTextPipe } from './pipes/currency-text/currency-text.pipe';
import { FundPerformanceChartComponent } from './components/fund-performance-chart/fund-performance-chart.component';
import { StateShowNamePipe } from './pipes/state-names/state-names.pipe';
import { CurrencyAmountValueComponent } from './components/currency-amount-value/currency-amount-value.component';
import { CommissionNamePipe } from './pipes/commission-name/commission-name.pipe';
import { CommissionsModalComponent } from './components/commissions-modal/commissions-modal.component';
import { CommissionsContentComponent } from './components/commissions-content/commissions-content.component';
import { CustomRangeModalComponent } from './components/custom-range-modal/custom-range-modal.component';
import { AbsoluteValuePipe } from './pipes/absolute-value/absolute-value.pipe';
import { FundCardComponent } from './components/fund-card/fund-card.component';

@NgModule({
  declarations: [
    FundPerformanceChartComponent,
    CurrencyPercentagePipe,
    CurrencyTextPipe,
    StateShowNamePipe,
    CurrencyAmountValueComponent,
    CommissionNamePipe,
    CommissionsModalComponent,
    CommissionsContentComponent,
    CustomRangeModalComponent,
    AbsoluteValuePipe,
    FundCardComponent
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
    CommissionNamePipe,
    CommissionsModalComponent,
    CommissionsContentComponent,
    CustomRangeModalComponent,
    AbsoluteValuePipe,
    FundCardComponent
  ],
  entryComponents: [CustomRangeModalComponent]
})
export class SharedFundsModule {}
