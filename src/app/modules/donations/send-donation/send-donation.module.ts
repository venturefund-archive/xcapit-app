import { NgModule } from '@angular/core';
import { SendDonationPage } from './send-donation.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDonationsModule } from '../shared-donations/shared-donations.module';

const routes: Routes = [
  {
    path: '',
    component: SendDonationPage,
  },

  {
    path: 'cause',
    component: SendDonationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedDonationsModule],
  declarations: [SendDonationPage],
})
export class SendDonationPageModule {}
