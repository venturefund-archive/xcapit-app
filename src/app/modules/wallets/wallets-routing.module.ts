import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';
import { AcceptedToSGuard } from './shared-wallets/guards/accepted-tos/accepted-tos.guard';
import { HasWallet } from '../../shared/guards/has-wallet/has-wallet';

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
        canActivate: [],
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
        path: 'no-wallet',
        loadChildren: () => import('./no-wallet/no-wallet.module').then((m) => m.NoWalletPageModule),
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
        canActivate: [AcceptedToSGuard],
        path: 'create-password',
        loadChildren: () => import('./create-password/create-password.module').then((m) => m.CreatePasswordPageModule),
      },
      {
        path: 'receive',
        children: [
          {
            path: 'select-currency',
            loadChildren: () =>
              import('./receive-select-currency/receive-select-currency.module').then(
                (m) => m.ReceiveSelectCurrencyPageModule
              ),
          },
          {
            path: 'detail',
            loadChildren: () => import('./receive/receive.module').then((m) => m.ReceivePageModule),
          },
        ],
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
          {
            path: 'info',
            loadChildren: () =>
              import('./recovery-phrase-information/recovery-phrase-information.module').then(
                (m) => m.RecoveryPhraseInformationPageModule
              ),
          },
          {
            path: 'read',
            loadChildren: () =>
              import('./recovery-phrase-read/recovery-phrase-read.module').then((m) => m.RecoveryPhraseReadPageModule),
          },
          {
            path: 'info-no-wallet',
            loadChildren: () =>
              import('./recovery-phrase-no-wallet/recovery-phrase-no-wallet.module').then(
                (m) => m.RecoveryPhraseNoWalletPageModule
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
        path: 'token-detail',
        loadChildren: () => import('./token-detail/token-detail.module').then((m) => m.TokenDetailPageModule),
      },
      {
        path: 'password-change',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./password/wallet-password-change/wallet-password-change.module').then(
                (m) => m.WalletPasswordChangePageModule
              ),
          },
          {
            path: 'success',
            loadChildren: () =>
              import('./password/wallet-password-change-success/wallet-password-change-success.module').then(
                (m) => m.WalletPasswordChangeSuccessPageModule
              ),
          },
          {
            path: 'error',
            loadChildren: () =>
              import('./password/wallet-password-change-error/wallet-password-change-error.module').then(
                (m) => m.WalletPasswordChangeErrorPageModule
              ),
          },
        ],
      },
      {
        path: 'nft-detail',
        loadChildren: () => import('./nft-detail/nft-detail.module').then((m) => m.NftDetailPageModule),
      },
      {
        path: 'wallet-connect',
        canActivate: [HasWallet],
        children: [
          {
            path: 'new-connection',
            loadChildren: () =>
              import('./wallet-connect/new-connection/new-connection.module').then((m) => m.NewConnectionPageModule),
          },
          {
            path: 'connection-detail',
            loadChildren: () =>
              import('./wallet-connect/connection-detail/connection-detail.module').then(
                (m) => m.ConnectionDetailPageModule
              ),
          },
          {
            path: 'operation-detail',
            loadChildren: () =>
              import('./wallet-connect/operation-detail/operation-detail.module').then(
                (m) => m.OperationDetailPageModule
              ),
          },
        ],
      },
      {
        path: 'remove',
        loadChildren: () => import('./remove/remove-wallet/remove-wallet.module').then((m) => m.RemoveWalletPageModule),
      },
      {
        path: 'export-private-key',
        loadChildren: () =>
          import('./export-private-key/export-private-key.module').then((m) => m.ExportPrivateKeyPageModule),
      },
      {
        path: 'remove',
        children: [
          {
            path: 'success',
            loadChildren: () =>
              import('./remove/success-remove-wallet/success-remove-wallet.module').then(
                (m) => m.SuccessRemoveWalletPageModule
              ),
          },
        ],
      },
      {
        path: 'transaction-details',
        loadChildren: () =>
          import('./transaction-details/transaction-details.module').then((m) => m.TransactionDetailsPageModule),
      },
      {
        path: 'experimental-onboarding',
        loadChildren: () =>
          import('./experimental-onboarding/experimental-onboarding.module').then(
            (m) => m.ExperimentalOnboardingPageModule
          ),
      },
      {
        path: 'derived-path-options',
        loadChildren: () =>
          import('./derived-path-options/derived-path-options.module').then((m) => m.DerivedPathOptionsPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletsRoutingModule {}
