import { NgModule } from '@angular/core';
import { CausesPage } from './causes.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDonationsModule } from '../shared-donations/shared-donations.module';

const routes: Routes = [
  {
    path: '',
    component: CausesPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes), SharedDonationsModule
  ],
  declarations: [CausesPage]
})
export class CausesPageModule {}
