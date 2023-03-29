import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HasWallet } from 'src/app/shared/guards/has-wallet/has-wallet';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';
import { SwapTYCAccepted } from './shared-swaps/guards/swap-tyc-accepted';

const routes: Routes = [
  {
    path: 'swaps',
    canActivate: [AuthGuard],
    children: [
      {
        canActivate: [SwapTYCAccepted],
        path: 'home',
        loadChildren: () => import('./swap-home/swap-home.module').then((m) => m.SwapHomePageModule),
      },
      {
        path: 'select-currency',
        loadChildren: () =>
          import('./swap-select-token/swap-select-token.module').then((m) => m.SwapSelectTokenPageModule),
      },
      {
        path: 'swap-terms-and-conditions',
        loadChildren: () =>
          import('./swap-terms-and-conditions/swap-terms-and-conditions.module').then(
            (m) => m.SwapTermsAndConditionsPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwapsRoutingModule {}
