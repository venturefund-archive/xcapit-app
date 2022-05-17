import { NgModule } from '@angular/core';
import { ReferralsClosedPage } from './referrals-closed.page';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ReferralsClosedPage,
  },
];

@NgModule({
  imports: [
   SharedReferralsModule, RouterModule.forChild(routes)
  ],
  declarations: [ReferralsClosedPage]
})
export class ReferralsClosedPageModule {}
