import { NgModule } from '@angular/core';
import { PaypalPaymentPage } from './paypal-payment.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PaypalPaymentPage,
  },
];

@NgModule({
  declarations: [PaypalPaymentPage],
  imports: [RouterModule.forChild(routes), SharedModule],
  providers: [SharedModule],
})
export class PaypalPaymentPageModule {}
