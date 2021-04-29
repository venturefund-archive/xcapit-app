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
        loadChildren: () =>
          import('./new-referral/new-referral.module').then(
            m => m.NewReferralPageModule
          )
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./referrals-list/referrals-list.module').then(
            m => m.ReferralsListPageModule
          )
      },
      {
        path: 'new-page',
        canActivate: [UserProfileDataGuard],
        loadChildren: () => import('./new-page/new-page.module').then( m => m.NewPagePageModule)
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralsRoutingModule {}
