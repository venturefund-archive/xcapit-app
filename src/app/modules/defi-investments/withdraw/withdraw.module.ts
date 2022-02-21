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
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./defi-investment-withdraw/defi-investment-withdraw.module').then(
        (m) => m.DefiInvestmentWithdrawPageModule
      ),
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class WithdrawModule {}
