import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileDataGuard } from '../profiles/shared-profiles/guards/user-profile-data/user-profile-data.guard';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { TacAcceptedGuard } from '../terms-and-conditions/shared-terms-and-conditions/guards/tac-accepted/tac-accepted.guard';
import { IsSubscribedGuard } from '../subscriptions/shared-subscriptions/guards/is-subscribed/is-subscribed.guard';

export const routes: Routes = [
  {
    path: 'funds',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'list',
        loadChildren: './funds-list/funds-list.module#FundsListPageModule'
      },
      {
        path: 'fund-summary/:fundName',
        canActivate: [IsSubscribedGuard],
        loadChildren: './fund-summary/fund-summary.module#FundSummaryPageModule'
      },
      {
        path: 'runs/:fundName',
        canActivate: [IsSubscribedGuard],
        loadChildren: './fund-runs/fund-runs.module#FundRunsPageModule'
      },
      {
        path: 'fund-balance/:fundName',
        loadChildren: './fund-balance/fund-balance.module#FundBalancePageModule'
      },
      {
        path: 'action',
        canActivate: [UserProfileDataGuard],
        children: [
          {
            path: '',
            canActivate: [TacAcceptedGuard],
            loadChildren: './new-fund/new-fund.module#NewFundPageModule'
          }
        ]
      },
      {
        path: 'deposit-address',
        loadChildren:
          './deposit-address/deposit-address.module#DepositAddressPageModule'
      },
      {
        path: 'commissions',
        loadChildren:
          './commission/commission.module#CommissionPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundsRoutingModule {}
