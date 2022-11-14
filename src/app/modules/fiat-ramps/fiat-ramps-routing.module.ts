import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';
import { HasWallet } from '../../shared/guards/has-wallet/has-wallet';
import { HasAcceptedBuyConditionsGuard } from './shared-ramps/guards/has-accepted-buy-conditions/has-accepted-buy-conditions.guard';

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
        canActivate: [HasAcceptedBuyConditionsGuard],
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
        canActivate: [HasAcceptedBuyConditionsGuard],
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
        path: 'summary-data',
        loadChildren: () =>
          import('./kyc-summary-data/kyc-summary-data.module').then((m) => m.KycSummaryDataPageModule),
      },
      {
        path: 'purchases',
        loadChildren: () =>
          import('./home-of-purchases/home-of-purchases.module').then((m) => m.HomeOfPurchasesPageModule),
      },
      {
        path: 'kyc',
        children: [
          {
            path: 'validation/:digitalDocument',
            loadChildren: () => import('./kyc-validation/kyc-validation.module').then((m) => m.KycValidationPageModule),
          },
          {
            path: 'confirmation/:digitalDocument',
            loadChildren: () =>
              import('./kyc-confirmation/kyc-confirmation.module').then((m) => m.KycConfirmationPageModule),
          },
        ],
      },
      {
        path: 'purchase-order',
        loadChildren: () => import('./purchase-order/purchase-order.module').then((m) => m.PurchaseOrderPageModule),
      },
      {
        path: 'error-operation-km',
        loadChildren: () =>
          import('./error-operation-km/error-operation-km.module').then((m) => m.ErrorOperationKmPageModule),
      },
      {
        path: 'kripton-operation-detail/:operation_id',
        loadChildren: () =>
          import('./kripton-operation-detail/kripton-operation-detail.module').then(
            (m) => m.KriptonOperationDetailPageModule
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
