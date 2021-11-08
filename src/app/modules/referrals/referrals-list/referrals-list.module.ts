import { NgModule } from '@angular/core';
import { ReferralsListPage } from './referrals-list.page';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';
import { RouterModule, Routes } from '@angular/router';
import { ShareReferralCardComponent } from './components/share-referral-card/share-referral-card.component';
import { PointsCardComponent } from './components/points-card/points-card.component';
import { PrizeCardComponent } from './components/prize-card/prize-card.component';

const routes: Routes = [
  {
    path: '',
    component: ReferralsListPage,
  },
];

@NgModule({
  imports: [SharedReferralsModule, RouterModule.forChild(routes)],
  declarations: [ReferralsListPage, ShareReferralCardComponent, PointsCardComponent, PrizeCardComponent],
})
export class ReferralsListPageModule {}
