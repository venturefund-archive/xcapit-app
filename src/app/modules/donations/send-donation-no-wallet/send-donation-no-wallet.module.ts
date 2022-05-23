import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedDonationsModule } from '../shared-donations/shared-donations.module';
import { SendDonationNoWalletPage } from './send-donation-no-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: SendDonationNoWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedDonationsModule],
  declarations: [SendDonationNoWalletPage]
})

export class SendDonationNoWalletPageModule {}
