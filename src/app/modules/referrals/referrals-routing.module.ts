import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { UserProfileDataGuard } from '../profiles/shared-profiles/guards/user-profile-data/user-profile-data.guard';

const routes: Routes = [
  {
    path: 'referrals',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'new',
        canActivate: [UserProfileDataGuard],
        loadChildren: './new-referral/new-referral.module#NewReferralPageModule'
      },
      {
        path: 'list',
        loadChildren:
          './referrals-list/referrals-list.module#ReferralsListPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralsRoutingModule {}
