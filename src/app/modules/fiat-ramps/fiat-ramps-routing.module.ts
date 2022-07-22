import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';
import { UserHasOperationsGuard } from './shared-ramps/guards/user-has-operations/user-has-operations.guard';
import { HasWallet } from '../../shared/guards/has-wallet/has-wallet';

const routes: Routes = [
  {
    path: 'fiat-ramps',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'new-operation',
        children: [
          {
            path: 'kripton',
            loadChildren: () => import('./operations-new/operations-new.module').then((m) => m.OperationsNewPageModule),
          },
          {
            path: 'moonpay',
            canActivate: [HasWallet],
            loadChildren: () => import('./moonpay/moonpay.module').then((m) => m.MoonpayPageModule),
          },
          {
            path: 'others/:alias',
            loadChildren: () => import('./directa/directa.module').then((m) => m.DirectaPageModule),
          },
        ],
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
        path: 'operation-detail/provider/:provider_id/operation/:operation_id',
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
      {
        path: 'information-paxful',
        loadChildren: () =>
          import('./information-paxful/information-paxful.module').then((m) => m.InformationPaxfulPageModule),
      },
      {
        path: 'token-selection',
        loadChildren: () =>
          import('./provider-token-selection/provider-token-selection.module').then(
            (m) => m.ProviderTokenSelectionPageModule
          ),
      },
      {
        path: 'buy-conditions',
        loadChildren: () => import('./buy-conditions/buy-conditions.module').then((m) => m.BuyConditionsPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiatRampsRoutingModule {}
