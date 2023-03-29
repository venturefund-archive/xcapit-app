import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthNewGuard } from '../users/shared-users/guards/auth-new/auth-new.guard';

const routes: Routes = [
  {
    path: 'referrals',
    canActivate: [AuthNewGuard],
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
        path: 'tos',
        loadChildren: () => import('./referrals-tos/referrals-tos.module').then((m) => m.ReferralsTosPageModule),
      },
      {
        path: 'info',
        loadChildren: () => import('./referrals-info/referrals-info.module').then((m) => m.ReferralsInfoPageModule),
      },
      {
        path: 'success-claim',
        loadChildren: () => import('./success-claim/success-claim.module').then((m) => m.SuccessClaimPageModule),
      },
      {
        path: 'closed',
        loadChildren: () =>
          import('./referrals-closed/referrals-closed.module').then((m) => m.ReferralsClosedPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferralsRoutingModule {}
