import { NgModule } from '@angular/core';
import { PaymentSuccessPage } from './payment-success.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedPaymentsModule } from '../shared-payments/shared-payments.module';

const routes: Routes = [
  {
    path: '',
    component: PaymentSuccessPage,
  },
];

@NgModule({
  imports: [SharedPaymentsModule, RouterModule.forChild(routes)],
  declarations: [PaymentSuccessPage],
})
export class PaymentSuccessPageModule {}
