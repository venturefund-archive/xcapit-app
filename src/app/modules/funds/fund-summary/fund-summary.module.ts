import { NgModule } from '@angular/core';
import { FundSummaryPageRoutingModule } from './fund-summary-routing.module';
import { FundSummaryPage } from './fund-summary.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { StopLossTakeProfitSummaryComponent } from './components/stop-loss-take-profit-summary/stop-loss-take-profit-summary.component';

@NgModule({
  imports: [FundSummaryPageRoutingModule, SharedFundsModule],
  declarations: [FundSummaryPage, StopLossTakeProfitSummaryComponent],
})
export class FundSummaryPageModule {}
