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
        path: 'test',
        loadChildren: () => import('./test-wallet/test-wallet.module').then((m) => m.TestWalletPageModule),
      },
      {
        path: 'create-first/disclaimer',
        loadChildren: () =>
          import('./disclaimer-wallet/disclaimer-wallet.module').then((m) => m.DisclaimerWalletPageModule),
      },
      {
        canActivate: [AcceptedToSGuard],
        path: 'create-first/recovery-phrase',
        loadChildren: () => import('./recovery-phrase/recovery-phrase.module').then((m) => m.RecoveryPhrasePageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletsRoutingModule {}
