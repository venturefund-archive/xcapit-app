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
        path: 'account',
        loadChildren: () => import('./support-account/support-account.module').then((m) => m.SupportAccountPageModule),
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
        path: 'security',
        loadChildren: () =>
          import('./support-security/support-security.module').then((m) => m.SupportSecurityPageModule),
      },
      {
        path: 'defi',
        loadChildren: () => import('./support-defi/support-defi.module').then((m) => m.SupportDefiPageModule),
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
        path: 'binance-investments',
        loadChildren: () =>
          import('./support-binance-investments/support-binance-investments.module').then(
            (m) => m.SupportBinanceInvestmentsPageModule
          ),
      },
      {
        path: 'apikey-binance',
        loadChildren: () =>
          import('./support-apikey-binance/support-apikey-binance.module').then(
            (m) => m.SupportApikeyBinancePageModule
          ),
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
