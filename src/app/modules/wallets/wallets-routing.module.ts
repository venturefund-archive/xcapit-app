import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { AcceptedToSGuard } from './shared-wallets/guards/accepted-tos/accepted-tos.guard';

const routes: Routes = [
  {
    path: 'wallets',
    canActivate: [AuthGuard],
    children: [
      {
        canActivate: [AcceptedToSGuard],
        path: 'create-first/recovery-phrase',
        loadChildren: () => import('./recovery-phrase/recovery-phrase.module').then((m) => m.RecoveryPhrasePageModule),
      },
      {
        canActivate: [AcceptedToSGuard],
        path: 'create-first/verify-phrase',
        loadChildren: () => import('./verify-phrase/verify-phrase.module').then((m) => m.VerifyPhrasePageModule),
      },
      {
        path: 'create-first/disclaimer',
        loadChildren: () =>
          import('./disclaimer-wallet/disclaimer-wallet.module').then((m) => m.DisclaimerWalletPageModule),
      },
      {
        canActivate: [AcceptedToSGuard],
        path: 'select-coins',
        loadChildren: () =>
          import('./select-coins-wallet/select-coins-wallet.module').then((m) => m.SelectCoinsWalletPageModule),
      },
      {
        canActivate: [AcceptedToSGuard],
        path: 'success-creation',
        loadChildren: () =>
          import('./success-creation/success-creation.module').then((m) => m.SuccessCreationPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletsRoutingModule {}
