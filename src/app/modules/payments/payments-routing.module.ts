import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'payment',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'payment-methods',
        loadChildren: () => import('./payment-methods/payment-methods.module').then((m) => m.PaymentMethodsPageModule),
      },
      {
        path: 'contact-license',
        loadChildren: () => import('./contact-license/contact-license.module').then((m) => m.ContactLicensePageModule),
      },
      {
        path: 'select-license',
        loadChildren: () =>
          import('./select-license/select-license/select-license.module').then((m) => m.SelectLicensePageModule),
      },
      {
        path: 'payment-success',
        loadChildren: () => import('./payment-success/payment-success.module').then((m) => m.PaymentSuccessPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule {}
