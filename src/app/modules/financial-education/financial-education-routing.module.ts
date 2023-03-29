import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthNewGuard } from '../users/shared-users/guards/auth-new/auth-new.guard';

const routes: Routes = [
  {
    path: 'financial-education',
    canActivate: [AuthNewGuard],
    children: [
      {
        path: 'introduction',
        children: [
          {
            path: 'financial-freedom',
            loadChildren: () =>
              import('./introduction/financial-freedom/financial-freedom.module').then(
                (m) => m.FinancialFreedomPageModule
              ),
          },
          {
            path: 'explanation',
            loadChildren: () =>
              import('./introduction/explanation/explanation.module').then((m) => m.ExplanationPageModule),
          },
        ],
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./home-financial-education/home-financial-education.module').then(
            (m) => m.HomeFinancialEducationPageModule
          ),
      },
      {
        path: 'error-test',
        loadChildren: () => import('./error-test/error-test.module').then((m) => m.ErrorTestPageModule),
      },
      {
        path: 'error-no-wallet',
        loadChildren: () => import('./error-no-wallet/error-no-wallet.module').then((m) => m.ErrorNoWalletPageModule),
      },
      {
        path: 'success-submodules',
        loadChildren: () =>
          import('./success-submodules/success-submodules.module').then((m) => m.SuccessSubmodulesPageModule),
      },
      {
        path: 'information',
        loadChildren: () =>
          import('./sub-module-information/sub-module-information.module').then(
            (m) => m.SubModuleInformationPageModule
          ),
      },
      {
        path: 'typeform',
        loadChildren: () => import('./test-typeform/test-typeform.module').then((m) => m.TestTypeformPageModule),
      },
      {
        path: 'final-success-test',
        loadChildren: () =>
          import('./final-success-test/final-success-test.module').then((m) => m.FinalSuccessTestPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialEducationRoutingModule {}
