import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewReferralPage } from './new-referral.page';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';
import { ReferralFormComponent } from './components/referral-form/referral-form.component';

const routes: Routes = [
  {
    path: '',
    component: NewReferralPage
  }
];

@NgModule({
  declarations: [NewReferralPage, ReferralFormComponent],
  imports: [
    SharedReferralsModule,
    RouterModule.forChild(routes)
  ]
})
export class NewReferralPageModule {}
