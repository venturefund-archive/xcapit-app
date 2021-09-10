import { NgModule } from '@angular/core';
import { SendSummaryPageRoutingModule } from './send-summary-routing.module';
import { SendSummaryPage } from './send-summary.page';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';

@NgModule({
  imports: [SharedWalletsModule, SendSummaryPageRoutingModule],
  declarations: [SendSummaryPage],
})
export class SendSummaryPageModule {}
