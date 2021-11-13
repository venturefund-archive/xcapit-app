import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferralsTosPage } from './referrals-tos.page';

const routes: Routes = [
  {
    path: '',
    component: ReferralsTosPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferralsTosPageRoutingModule {}
