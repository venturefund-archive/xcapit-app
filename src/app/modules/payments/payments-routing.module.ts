import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path:'payment',
    canActivate: [AuthGuard],
    children:[
      {
        path: 'paypal-payment',
        loadChildren: () => import('./paypal-payment/paypal-payment.module').then( m => m.PaypalPaymentPageModule)
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
