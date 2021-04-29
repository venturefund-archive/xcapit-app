import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:'payment',
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
