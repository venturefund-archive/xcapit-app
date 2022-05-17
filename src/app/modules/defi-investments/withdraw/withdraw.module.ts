import { NgModule } from '@angular/core';
import { AuthGuard } from '../../usuarios/shared-usuarios/guards/auth/auth.guard';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: 'success',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./defi-investment-success-withdraw/defi-investment-success-withdraw.module').then(
        (m) => m.DefiInvestmentSuccessWithdrawPageModule
      ),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./defi-investment-error-withdraw/defi-investment-error-withdraw.module').then(
        (m) => m.DefiInvestmentErrorWithdrawPageModule
      ),
  },
  {
    path: 'select-amount/:vault',
    loadChildren: () =>
      import('../withdraw/select-amount-withdraw/select-amount-withdraw.module').then(
        (m) => m.SelectAmountWithdrawPageModule
      ),
  },
  {
    path: 'confirmation',
    loadChildren: () =>
      import('./withdraw-confirmation/withdraw-confirmation.module').then((m) => m.WithdrawConfirmationPageModule),
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class WithdrawModule {}
