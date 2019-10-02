import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferralsListPage } from './referrals-list.page';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';
import { SkeletonReferralItemComponent } from './components/skeleton-referral-item/skeleton-referral-item.component';

const routes: Routes = [
  {
    path: '',
    component: ReferralsListPage
  }
];

@NgModule({
  imports: [
    SharedReferralsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReferralsListPage, SkeletonReferralItemComponent]
})
export class ReferralsListPageModule {}
