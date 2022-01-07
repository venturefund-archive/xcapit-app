import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'wealth-management',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'investor-test-options',
        loadChildren: () =>
          import('./investor-test-options/investor-test-options.module').then((m) => m.InvestorTestOptionsPageModule),
      },
      {
        path: 'success-investor-test',
        loadChildren: () =>
          import('./success-investor-test/success-investor-test.module').then((m) => m.SuccessInvestorTestPageModule),
      },
      {
        path: 'investor-test',
        loadChildren: () =>
          import('./investor-test-question/investor-test-question.module').then(
            (m) => m.InvestorTestQuestionPageModule
          ),
      },
      {
        path: 'about-investor-profiles',
        loadChildren: () =>
          import('./about-investor-profiles/about-investor-profiles.module').then(
            (m) => m.AboutInvestorProfilesPageModule
          ),
      },
      {
        path: 'no-wallet-to-invest',
        loadChildren: () =>
          import('./no-wallet-to-invest/no-wallet-to-invest.module').then((m) => m.NoWalletToInvestPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WealthManagementsRoutingModule {}
