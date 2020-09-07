import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'deposits',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'currency',
        loadChildren: () =>
          import('./deposit-currency/deposit-currency.module').then(
            m => m.DepositCurrencyPageModule
          )
      },
      {
        path: 'address/:currency',
        loadChildren: () =>
          import('./deposit-address/deposit-address.module').then(
            m => m.DepositAddressPageModule
          )
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositAddressesRoutingModule { }
