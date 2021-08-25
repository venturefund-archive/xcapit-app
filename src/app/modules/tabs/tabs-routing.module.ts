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
        path: 'funds',
        loadChildren: () => import('../funds/funds-list/funds-list.module').then((m) => m.FundsListPageModule),
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
