import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileDataGuard } from '../profiles/shared-profiles/guards/user-profile-data/user-profile-data.guard';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'funds',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'list',
        loadChildren: './funds-list/funds-list.module#FundsListPageModule'
      },
      {
        path: 'new',
        canActivate: [UserProfileDataGuard, AuthGuard],
        loadChildren: './new-fund/new-fund.module#NewFundPageModule'
      },
      {
        path: 'fund-summary',
        loadChildren: './fund-summary/fund-summary.module#FundSummaryPageModule'
      },
      {
        path: 'runs/:nombre_bot',
        loadChildren: './fund-runs/fund-runs.module#FundRunsPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundsRoutingModule {}
