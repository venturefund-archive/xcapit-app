import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { IsOwnerGuard } from './shared-funds/guards/is-owner-guard/is-owner.guard';
import { BeforeStepDataGuard } from './shared-funds/guards/before-steps-data-guard/before-step-data.guard';
import { UserStatusGuard } from './shared-funds/guards/user-status-guard/user-status-guard.guard';
import { HasApiKeyIdGuard } from './shared-funds/guards/has-api-key-id/has-api-key-id.guard';

export const routes: Routes = [
  {
    path: 'funds',
    canActivate: [AuthGuard],
    children: [
      {
        canActivate: [UserStatusGuard],
        path: 'list',
        loadChildren: () => import('./funds-list/funds-list.module').then((m) => m.FundsListPageModule),
      },
      {
        path: 'detail/:fundName',
        loadChildren: () => import('./fund-detail/fund-detail.module').then((m) => m.FundDetailPageModule),
      },
      {
        path: 'fund-name',
        loadChildren: () => import('./fund-name/fund-name.module').then((m) => m.FundNamePageModule),
      },
      {
        path: 'fund-investment',
        loadChildren: () => import('./fund-investment/fund-investment.module').then((m) => m.FundInvestmentPageModule),
      },
      {
        path: 'fund-duration',
        canActivate: [BeforeStepDataGuard],
        loadChildren: () => import('./fund-duration/fund-duration.module').then((m) => m.FundDurationPageModule),
      },
      {
        path: 'fund-take-profit',
        canActivate: [BeforeStepDataGuard],
        loadChildren: () =>
          import('./fund-take-profit/fund-take-profit.module').then((m) => m.FundTakeProfitPageModule),
      },
      {
        path: 'fund-stop-loss',
        canActivate: [BeforeStepDataGuard],
        loadChildren: () => import('./fund-stop-loss/fund-stop-loss.module').then((m) => m.FundStopLossPageModule),
      },
      {
        path: 'fund-success',
        loadChildren: () => import('./fund-success/fund-success.module').then((m) => m.FundSuccessPageModule),
      },
      {
        path: 'commissions',
        loadChildren: () => import('./commission/commission.module').then((m) => m.CommissionPageModule),
      },
      {
        path: 'fund-settings/:name',
        loadChildren: () => import('./fund-settings/fund-settings.module').then((m) => m.FundSettingsPageModule),
      },
      {
        path: 'funds-finished',
        loadChildren: () => import('./funds-finished/funds-finished.module').then((m) => m.FundsFinishedPageModule),
      },
      {
        path: 'fund-operations/:fundName',
        loadChildren: () => import('./fund-operations/fund-operations.module').then((m) => m.FundOperationsPageModule),
      },
      {
        path: 'fund-operations-detail/:orderID',
        loadChildren: () =>
          import('./fund-operations-detail/fund-operations-detail.module').then(
            (m) => m.FundOperationsDetailPageModule
          ),
      },
      {
        path: 'edit-stop-loss/:fundName',
        loadChildren: () =>
          import('./fund-edit-stop-loss/fund-edit-stop-loss.module').then((m) => m.FundEditStopLossPageModule),
      },
      {
        path: 'edit-take-profit/:fundName',
        loadChildren: () =>
          import('./fund-edit-take-profit/fund-edit-take-profit.module').then((m) => m.FundEditTakeProfitPageModule),
      },
      {
        path: 'fund-timeline-detail/:fundName/:runID',
        canActivate: [IsOwnerGuard],
        loadChildren: () =>
          import('./fund-timeline-detail/fund-timeline-detail.module').then((m) => m.FundTimelineDetailPageModule),
      },
      {
        path: 'fund-investment-info/:strategy',
        loadChildren: () =>
          import('./fund-investment-info/fund-investment-info.module').then((m) => m.FundInvestmentInfoPageModule),
      },
      {
        path: 'inteligent-stop-loss-information',
        loadChildren: () =>
          import('./inteligent-stop-loss-information/inteligent-stop-loss-information.module').then(
            (m) => m.InteligentStopLossInformationPageModule
          ),
      },
      {
        path: 'summary',
        canActivate: [HasApiKeyIdGuard, BeforeStepDataGuard],
        loadChildren: () => import('./fund-summary/fund-summary.module').then((m) => m.FundSummaryPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FundsRoutingModule {}
