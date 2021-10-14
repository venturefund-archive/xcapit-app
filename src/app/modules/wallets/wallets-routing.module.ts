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
        canActivate: [AcceptedToSGuard],
        path: 'success-creation',
        loadChildren: () =>
          import('./success-creation/success-creation.module').then((m) => m.SuccessCreationPageModule),
      },
      {
        path: 'failed-mnemonic',
        loadChildren: () => import('./failed-mnemonic/failed-mnemonic.module').then((m) => m.FailedMnemonicPageModule),
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
        path: 'recovery',
        loadChildren: () => import('./recovery-wallet/recovery-wallet.module').then((m) => m.RecoveryWalletPageModule),
        canActivate: [AcceptedToSGuard],
      },
      {
        path: 'recovery',
        children: [
          {
            path: 'error',
            loadChildren: () =>
              import('./error-recovery-wallet/error-recovery-wallet.module').then(
                (m) => m.ErrorRecoveryWalletPageModule
              ),
          },
          {
            path: 'success',
            loadChildren: () =>
              import('./success-recovery-wallet/success-recovery-wallet.module').then(
                (m) => m.SuccessRecoveryWalletPageModule
              ),
          },
        ],
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
          {
            path: 'summary',
            loadChildren: () => import('./send/send-summary/send-summary.module').then((m) => m.SendSummaryPageModule),
          },
          {
            path: 'success',
            loadChildren: () => import('./send/send-success/send-success.module').then((m) => m.SendSuccessPageModule),
          },
          {
            path: 'error/incorrect-password',
            loadChildren: () =>
              import('./send/error-incorrect-password-wallet/error-incorrect-password-wallet.module').then(
                (m) => m.ErrorIncorrectPasswordWalletPageModule
              ),
          },
          {
            path: 'error/wrong-amount',
            loadChildren: () =>
              import('./send/error-wrong-amount-wallet/error-wrong-amount-wallet.module').then(
                (m) => m.ErrorWrongAmountWalletPageModule
              ),
          },
          {
            path: 'error/wrong-address',
            loadChildren: () =>
              import('./send/error-wrong-address-wallet/error-wrong-address-wallet.module').then(
                (m) => m.ErrorWrongAddressWalletPageModule
              ),
          },
        ],
      },
      {
        path: 'asset-detail/:currency',
        loadChildren: () => import('./asset-detail/asset-detail.module').then((m) => m.AssetDetailPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletsRoutingModule {}
