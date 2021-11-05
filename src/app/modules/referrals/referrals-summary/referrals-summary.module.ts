import { NgModule } from '@angular/core';
import { ReferralsSummaryPage } from './referrals-summary.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';

const routes: Routes = [
  {
    path: '',
    component: ReferralsSummaryPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedReferralsModule],
  declarations: [ReferralsSummaryPage],
})
export class ReferralsSummaryPageModule {}
