import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'fiat-ramps',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'new-operation',
        loadChildren: () => import('./operations-new/operations-new.module').then((m) => m.OperationsNewPageModule),
      },
      {
        path: 'confirm-page',
        loadChildren: () => import('./confirm-page/confirm-page.module').then((m) => m.ConfirmPagePageModule),
      },
      {
        path: 'user-information',
        loadChildren: () =>
          import('./user-information/user-information.module').then((m) => m.UserInformationPageModule),
      },
      {
        path: 'user-bank',
        loadChildren: () => import('./user-bank/user-bank.module').then((m) => m.UserBankPageModule),
      },
      {
        path: 'user-images',
        loadChildren: () => import('./user-images/user-images.module').then((m) => m.UserImagesPageModule),
      },
      {
        path: 'operations',
        loadChildren: () => import('./operations-page/operations-page.module').then((m) => m.OperationsPagePageModule),
      },
      {
        path: 'operations-detail/provider/:provider_id/operation/:operation_id',
        loadChildren: () =>
          import('./operations-detail/operations-detail.module').then((m) => m.OperationsDetailPageModule),
      },
      {
        path: 'new-operation-paxful',
        loadChildren: () =>
          import('./operations-new-paxful/operations-new-paxful.module').then((m) => m.OperationsNewPaxfulPageModule),
      },
      {
        path: 'new-operation/success-paxful',
        loadChildren: () => import('./success-paxful/success-paxful.module').then((m) => m.SuccessPaxfulPageModule),
      },
      {
        path: 'success-page',
        loadChildren: () => import('./success-page/success-page.module').then((m) => m.SuccessPagePageModule),
      },
      {
        path: 'select-provider',
        loadChildren: () =>
          import('./select-provider-page/select-provider/select-provider.module').then(
            (m) => m.SelectProviderPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiatRampsRoutingModule {}
