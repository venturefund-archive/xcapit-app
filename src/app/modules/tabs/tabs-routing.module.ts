import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';
import { HasWallet } from 'src/app/shared/guards/has-wallet/has-wallet';
import { IntroductionCompletedGuard } from '../financial-education/shared-financial-education/guards/introduction-completed';

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
        loadChildren: () =>
          import('../defi-investments/defi-investment-products/defi-investment-products.module').then(
            (m) => m.DefiInvestmentProductsPageModule
          ),
      },
      {
        path: 'wallets',
        loadChildren: () => import('../wallets/home-wallet/home-wallet.module').then((m) => m.HomeWalletPageModule),
      },
      {
        path: 'financial-education',
        canActivate: [HasWallet, IntroductionCompletedGuard],
        loadChildren: () =>
          import('../financial-education/home-financial-education/home-financial-education.module').then(
            (m) => m.HomeFinancialEducationPageModule
          ),
      },
      {
        path: 'financial-education/information',
        loadChildren: () =>
          import('../financial-education/sub-module-information/sub-module-information.module').then(
            (m) => m.SubModuleInformationPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
