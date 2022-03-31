import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'defi',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'investment-detail/:vault',
        loadChildren: () =>
          import('./investment-detail/investment-detail.module').then((m) => m.InvestmentDetailPageModule),
      },
      {
        path: 'no-wallet-to-invest',
        loadChildren: () =>
          import('../defi-investments/no-wallet-to-invest/no-wallet-to-invest.module').then(
            (m) => m.NoWalletToInvestPageModule
          ),
      },
      {
        path: 'success-investment',
        loadChildren: () =>
          import('./success-investment/success-investment.module').then((m) => m.SuccessInvestmentPageModule),
      },
      {
        path: 'error-investment',
        loadChildren: () =>
          import('./error-investment/error-investment.module').then((m) => m.ErrorInvestmentPageModule),
      },
      {
        path: 'new',
        children: [
          {
            path: 'insert-amount/:vault',
            loadChildren: () =>
              import('./create/new-investment/new-investment.module').then((m) => m.NewInvestmentPageModule),
          },
          {
            path: 'confirmation',
            loadChildren: () =>
              import('./create/investment-confirmation/investment-confirmation.module').then(
                (m) => m.InvestmentConfirmationPageModule
              ),
          },
        ],
      },
      {
        path: 'withdraw',
        children: [
          {
            path: 'select-amount/:vault',
            loadChildren: () => import('./withdraw/select-amount-withdraw/select-amount-withdraw.module').then( m => m.SelectAmountWithdrawPageModule)
          },
          {
            path: 'confirmation',
            loadChildren: () => import('./withdraw/withdraw.module').then((m) => m.WithdrawModule),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefiInvestmentsRoutingModule {}
