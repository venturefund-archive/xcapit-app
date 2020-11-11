import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileDataGuard } from '../profiles/shared-profiles/guards/user-profile-data/user-profile-data.guard';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { TacAcceptedGuard } from '../terms-and-conditions/shared-terms-and-conditions/guards/tac-accepted/tac-accepted.guard';
import { IsSubscribedGuard } from '../subscriptions/shared-subscriptions/guards/is-subscribed/is-subscribed.guard';
import { BeforeStepDataGuard } from './shared-funds/guards/before-steps-data-guard/before-step-data.guard';

export const routes: Routes = [
  {
    path: 'funds',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'list',
        loadChildren: () =>
          import('./funds-list/funds-list.module').then(
            m => m.FundsListPageModule
          )
      },
      {
        path: 'detail/:fundName',
        loadChildren: () =>
          import('./fund-detail/fund-detail.module').then(
            m => m.FundDetailPageModule
          )
      },
      {
        path: 'fund-name',
        loadChildren: () =>
          import('./fund-name/fund-name.module').then(m => m.FundNamePageModule)
      },
      {
        path: 'fund-risk',
        canActivate: [BeforeStepDataGuard],
        loadChildren: () =>
          import('./fund-risk/fund-risk.module').then(m => m.FundRiskPageModule)
      },
      {
        path: 'fund-duration',
        canActivate: [BeforeStepDataGuard],
        loadChildren: () =>
          import('./fund-duration/fund-duration.module').then(
            m => m.FundDurationPageModule
          )
      },
      {
        path: 'fund-currency',
        canActivate: [BeforeStepDataGuard],
        loadChildren: () =>
          import('./fund-currency/fund-currency.module').then(
            m => m.FundCurrencyPageModule
          )
      },
      {
        path: 'fund-take-profit',
        canActivate: [BeforeStepDataGuard],
        loadChildren: () =>
          import('./fund-take-profit/fund-take-profit.module').then(
            m => m.FundTakeProfitPageModule
          )
      },
      {
        path: 'fund-stop-loss',
        loadChildren: () =>
          import('./fund-stop-loss/fund-stop-loss.module').then(
            m => m.FundStopLossPageModule
          )
      },
      {
        path: 'fund-success',
        loadChildren: () =>
          import('./fund-success/fund-success.module').then(
            m => m.FundSuccessPageModule
          )
      },
      {
        path: 'runs/:fundName',
        canActivate: [IsSubscribedGuard],
        loadChildren: () =>
          import('./fund-runs/fund-runs.module').then(m => m.FundRunsPageModule)
      },
      {
        path: 'commissions',
        loadChildren: () =>
          import('./commission/commission.module').then(
            m => m.CommissionPageModule
          )
      },
      {
        path: 'fund-settings/:name',
        loadChildren: () =>
          import('./fund-settings/fund-settings.module').then(
            m => m.FundSettingsPageModule
          )
      },
      {
        path: 'funds-finished',
        loadChildren: () =>
          import('./funds-finished/funds-finished.module').then(
            m => m.FundsFinishedPageModule
          )
      },
      {
        path: 'advanced/:fundName',
        loadChildren: () =>
          import('./fund-advanced/fund-advanced.module').then(
            m => m.FundAdvancedPageModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundsRoutingModule {}
