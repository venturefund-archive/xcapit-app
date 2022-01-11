import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'defi',
    canActivate: [AuthGuard],
    children: [
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
        path: 'create',
        children: [
          {
            path: 'insert-amount',
            loadChildren: () =>
              import('./create/new-investment/new-investment.module').then((m) => m.NewInvestmentPageModule),
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
