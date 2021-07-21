import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'wallets',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create-first/recovery-phrase',
        loadChildren: () => import('./recovery-phrase/recovery-phrase.module').then((m) => m.RecoveryPhrasePageModule),
      },
      {
        path: 'create-first/verify-phrase',
        loadChildren: () => import('./verify-phrase/verify-phrase.module').then((m) => m.VerifyPhrasePageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletsRoutingModule {}
