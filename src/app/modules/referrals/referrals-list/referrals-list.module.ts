import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferralsListPage } from './referrals-list.page';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';
import { ReferralIdCardComponent } from './components/referral-id-card/referral-id-card.component';

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
  declarations: [ReferralsListPage, ReferralIdCardComponent]
})
export class ReferralsListPageModule {}
