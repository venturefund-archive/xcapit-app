import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';
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
      {
        path: 'others',
        children: [
          {
            path: 'error-operation',
            loadChildren: () =>
              import('./error-d24-operation/error-d24-operation.module').then((m) => m.ErrorD24OperationPageModule),
          },
          {
            path: 'success-operation',
            loadChildren: () =>
              import('./success-d24-operation/success-d24-operation.module').then(
                (m) => m.SuccessD24OperationPageModule
              ),
          },
        ],
      },
      {
        path: 'user-email',
        loadChildren: () => import('./user-email/user-email.module').then((m) => m.UserEmailPageModule),
      },
      {
        path: 'user-register',
        loadChildren: () => import('./user-register/user-register.module').then((m) => m.UserRegisterPageModule),
      },
      {
        path: 'user-basic',
        loadChildren: () =>
          import('./kyc-user-basic-information/kyc-user-basic-information.module').then(
            (m) => m.KycUserBasicInformationPageModule
          ),
      },
      {
        path: 'user-personal-information',
        loadChildren: () =>
          import('./kyc-user-personal-information/kyc-user-personal-information.module').then(
            (m) => m.KycUserPersonalInformationPageModule
          ),
      },
      {
        path: 'user-address',
        loadChildren: () =>
          import('./kyc-user-address-information/kyc-user-address-information.module').then(
            (m) => m.KycUserAddressInformationPageModule
          ),
      },
      {
        path: 'kyc-front-id',
        loadChildren: () =>
          import('./kyc-front-id-validation/kyc-front-id-validation.module').then(
            (m) => m.KycFrontIdValidationPageModule
          ),
      },
      {
        path: 'kyc-front-id-confirmation',
        loadChildren: () =>
          import('./kyc-front-id-confirmation/kyc-front-id-confirmation.module').then(
            (m) => m.KycFrontIdConfirmationPageModule
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
