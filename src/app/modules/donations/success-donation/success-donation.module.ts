import { NgModule } from '@angular/core';
import { SuccessDonationPage } from './success-donation.page';
import { SharedDonationsModule } from '../shared-donations/shared-donations.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SuccessDonationPage
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedDonationsModule
  ],
  declarations: [SuccessDonationPage]
})
export class SuccessDonationPageModule {}
