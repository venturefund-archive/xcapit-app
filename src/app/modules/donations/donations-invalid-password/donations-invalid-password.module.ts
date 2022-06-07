import { NgModule } from '@angular/core';
import { DonationsInvalidPasswordPage } from './donations-invalid-password.page';
import { SharedDonationsModule } from '../shared-donations/shared-donations.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DonationsInvalidPasswordPage,
  },
];

@NgModule({
  imports: [SharedDonationsModule, RouterModule.forChild(routes)],
  declarations: [DonationsInvalidPasswordPage],
})
export class DonationsInvalidPasswordPageModule {}
