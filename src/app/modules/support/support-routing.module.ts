import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'support',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'options',
        loadChildren: () =>
          import('../support/support-options/support-options.module').then((m) => m.SupportOptionsPageModule),
      },
      {
        path: 'wallet-operations',
        loadChildren: () =>
          import('../support/support-wallet-operations/support-wallet-operations.module').then((m) => m.SupportWalletOperationsPageModule),
      },
     
      {
        path: 'wallet',
        loadChildren: () => import('./support-wallet/support-wallet.module').then((m) => m.SupportWalletPageModule),
      },
      {
        path: 'nft',
        loadChildren: () => import('./support-nft/support-nft.module').then((m) => m.SupportNftPageModule),
      },
     
      {
        path: 'wallet-connect',
        loadChildren: () =>
          import('./support-wallet-connect/support-wallet-connect.module').then(
            (m) => m.SupportWalletConnectPageModule
          ),
      },
      {
        path: 'buy',
        loadChildren: () => import('./support-buy/support-buy.module').then((m) => m.SupportBuyPageModule),
      },
      {
        path: 'wallet-info',
        loadChildren: () =>
          import('./wallet-terms-options/wallet-terms-options.module').then((m) => m.WalletTermsOptionsPageModule),
      },
      {
        path: 'wallet-info',
        children: [
          {
            path: 'terms',
            loadChildren: () => import('./wallet-terms/wallet-terms.module').then((m) => m.WalletTermsPageModule),
          },
          {
            path: 'privacy',
            loadChildren: () => import('./wallet-privacy/wallet-privacy.module').then((m) => m.WalletPrivacyPageModule),
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
export class SupportRoutingModule {}
