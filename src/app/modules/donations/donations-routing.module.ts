import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthNewGuard } from '../users/shared-users/guards/auth-new/auth-new.guard';
import { DonationsIntroductionCompletedGuard } from './shared-donations/guards/donations-introduction-completed';

const routes: Routes = [
  {
    path: 'donations',
    canActivate: [AuthNewGuard],
    children: [
      {
        path: 'information',
        loadChildren: () => import('./donations-info/donations-info.module').then((m) => m.DonationsInfoPageModule),
      },
      {
        path: 'causes',
        canActivate: [DonationsIntroductionCompletedGuard],
        loadChildren: () => import('./causes/causes.module').then((m) => m.CausesPageModule),
      },
      {
        path: 'description-cause',
        loadChildren: () =>
          import('./description-cause/description-cause.module').then((m) => m.DescriptionCausePageModule),
      },
      {
        path: 'send-donation',
        loadChildren: () => import('./send-donation/send-donation.module').then((m) => m.SendDonationPageModule),
      },
      {
        path: 'success',
        loadChildren: () =>
          import('./success-donation/success-donation.module').then((m) => m.SuccessDonationPageModule),
      },
      {
        path: 'error',
        loadChildren: () => import('./error-donation/error-donation.module').then((m) => m.ErrorDonationPageModule),
      },
      {
        path: 'summary-data',
        loadChildren: () =>
          import('./summary-data-send-donation/summary-data-send-donation.module').then(
            (m) => m.SummaryDataSendDonationPageModule
          ),
      },
      {
        path: 'no-wallet',
        loadChildren: () =>
          import('./send-donation-no-wallet/send-donation-no-wallet.module').then(
            (m) => m.SendDonationNoWalletPageModule
          ),
      },
      {
        path: 'invalid-password',
        loadChildren: () =>
          import('./donations-invalid-password/donations-invalid-password.module').then(
            (m) => m.DonationsInvalidPasswordPageModule
          ),
      },
      {
        path: 'token-selection',
        loadChildren: () => import('./token-selection/token-selection.module').then((m) => m.TokenSelectionPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationsRoutingModule {}
