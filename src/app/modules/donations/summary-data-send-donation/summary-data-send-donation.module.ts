import { NgModule } from '@angular/core';
import { SummaryDataSendDonationPage } from './summary-data-send-donation.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDonationsModule } from '../shared-donations/shared-donations.module';
import { SharedWalletsModule } from '../../wallets/shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: SummaryDataSendDonationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedDonationsModule, SharedWalletsModule],
  declarations: [SummaryDataSendDonationPage],
})
export class SummaryDataSendDonationPageModule {}
