import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedDonationsModule } from '../shared-donations/shared-donations.module';
import { ErrorDonationPage } from './error-donation.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorDonationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedDonationsModule],
  declarations: [ErrorDonationPage],
})
export class ErrorDonationPageModule {}
