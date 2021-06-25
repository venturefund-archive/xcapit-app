import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReferralsInfoPage } from './referrals-info.page';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ReferralsInfoPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedReferralsModule, RouterModule.forChild(routes)],
  declarations: [ReferralsInfoPage],
})
export class ReferralsInfoPageModule {}
