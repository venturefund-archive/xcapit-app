import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'donations',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'information',
        loadChildren: () => import('./donations-info/donations-info.module').then((m) => m.DonationsInfoPageModule),
      },
      {
        path: 'causes',
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
        loadChildren: () => import('./summary-data-send-donation/summary-data-send-donation.module').then( m => m.SummaryDataSendDonationPageModule)
      },
      {
        path: 'no-wallet',
        loadChildren: () => import('./send-donation-no-wallet/send-donation-no-wallet.module').then( m => m.SendDonationNoWalletPageModule)
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationsRoutingModule {}
