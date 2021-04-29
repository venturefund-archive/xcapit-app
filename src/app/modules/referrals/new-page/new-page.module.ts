import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { NewPagePage } from './new-page.page';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';
import { RouterModule, Routes } from '@angular/router';
import { ReferralIdCardComponent } from '../referrals-list/components/referral-id-card/referral-id-card.component';
import { ShareReferralCardComponent } from './components/share-referral-card/share-referral-card.component';
import { PointsCardComponent } from './components/points-card/points-card.component';

const routes: Routes = [
  {
    path: '',
    component: NewPagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedReferralsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewPagePage, ShareReferralCardComponent, PointsCardComponent]
})
export class NewPagePageModule {}
