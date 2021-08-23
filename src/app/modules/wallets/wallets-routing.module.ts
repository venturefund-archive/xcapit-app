import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { AcceptedToSGuard } from './shared-wallets/guards/accepted-tos/accepted-tos.guard';
import { CreatedWalletGuard } from './shared-wallets/guards/created-wallet/created-wallet.guard';

const routes: Routes = [
  {
    path: 'wallets',
    canActivate: [AuthGuard],
    children: [
      {
        canActivate: [AcceptedToSGuard, CreatedWalletGuard],
        path: 'create-first/recovery-phrase',
        loadChildren: () => import('./recovery-phrase/recovery-phrase.module').then((m) => m.RecoveryPhrasePageModule),
      },
      {
        canActivate: [AcceptedToSGuard, CreatedWalletGuard],
        path: 'create-first/verify-phrase',
        loadChildren: () => import('./verify-phrase/verify-phrase.module').then((m) => m.VerifyPhrasePageModule),
      },
      {
        canActivate: [CreatedWalletGuard],
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
        canActivate: [AcceptedToSGuard, CreatedWalletGuard],
        path: 'success-creation',
        loadChildren: () =>
          import('./success-creation/success-creation.module').then((m) => m.SuccessCreationPageModule),
      },
      {
        canActivate: [AcceptedToSGuard, CreatedWalletGuard],
        path: 'create-password',
        loadChildren: () => import('./create-password/create-password.module').then((m) => m.CreatePasswordPageModule),
      },
      {
        path: 'receive',
        loadChildren: () => import('./receive/receive.module').then((m) => m.ReceivePageModule),
      },
      {
        path: 'send',
        children: [
          {
            path: 'select-currency',
            loadChildren: () =>
              import('./send/select-currency/select-currency.module').then((m) => m.SelectCurrencyPageModule),
          },
          {
            path: 'detail',
            loadChildren: () => import('./send/send-detail/send-detail.module').then((m) => m.SendDetailPageModule),
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
export class WalletsRoutingModule {}
