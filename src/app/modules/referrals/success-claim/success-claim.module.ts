import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SuccessClaimPage } from './success-claim.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';
const routes: Routes = [
  {
    path: '',
    component: SuccessClaimPage,
  },
];
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedReferralsModule, RouterModule.forChild(routes)],
  declarations: [SuccessClaimPage],
})
export class SuccessClaimPageModule {}
