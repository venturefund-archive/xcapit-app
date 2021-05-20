import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReferralsListPage } from './referrals-list.page';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';
import { RouterModule, Routes } from '@angular/router';
import { ShareReferralCardComponent } from './components/share-referral-card/share-referral-card.component';
import { PointsCardComponent } from './components/points-card/points-card.component';

const routes: Routes = [
  {
    path: '',
    component: ReferralsListPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedReferralsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    ReferralsListPage,
    ShareReferralCardComponent,
    PointsCardComponent,
  ],
})
export class ReferralsListPageModule {}
