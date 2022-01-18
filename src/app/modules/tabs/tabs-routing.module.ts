import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home-page/home-page.module').then((m) => m.HomePageModule),
      },
      {
        path: 'investments',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../funds/investments-tab/investments-tab.module').then((m) => m.InvestmentsTabPageModule),
          },
          {
            path: 'binance',
            loadChildren: () => import('../funds/funds-list/funds-list.module').then((m) => m.FundsListPageModule),
          },
          {
            path: 'defi',
            loadChildren: () =>
              import('../defi-investments/coming-soon/coming-soon.module').then((m) => m.ComingSoonPageModule),
          },
        ],
      },
      {
        path: 'wallets',
        loadChildren: () => import('../wallets/home-wallet/home-wallet.module').then((m) => m.HomeWalletPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
