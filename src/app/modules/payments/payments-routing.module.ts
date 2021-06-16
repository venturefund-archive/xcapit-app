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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule {}
