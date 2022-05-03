import { NgModule } from '@angular/core';
import { DonationsInfoPage } from './donations-info.page';
import { SharedDonationsModule } from '../shared-donations/shared-donations.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DonationsInfoPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes), SharedDonationsModule
  ],
  declarations: [DonationsInfoPage]
})
export class DonationsInfoPageModule {}
