import { NgModule } from '@angular/core';
import { DescriptionCausePage } from './description-cause.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDonationsModule } from '../shared-donations/shared-donations.module';

const routes: Routes = [
  {
    path: '',
    component: DescriptionCausePage
  },
  {
    path: ':cause',
    component: DescriptionCausePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedDonationsModule],
  declarations: [DescriptionCausePage]
})
export class DescriptionCausePageModule {}
