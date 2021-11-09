import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'referrals',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'list',
        loadChildren: () => import('./referrals-list/referrals-list.module').then((m) => m.ReferralsListPageModule),
      },
      {
        path: 'summary',
        loadChildren: () =>
          import('./referrals-summary/referrals-summary.module').then((m) => m.ReferralsSummaryPageModule),
      },
      {
        path: 'info',
        loadChildren: () => import('./referrals-info/referrals-info.module').then((m) => m.ReferralsInfoPageModule),
      },
      {
        path: 'success-claim',
        loadChildren: () => import('./success-claim/success-claim.module').then((m) => m.SuccessClaimPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferralsRoutingModule {}
