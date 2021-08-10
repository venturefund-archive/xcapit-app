import { NgModule } from '@angular/core';
import { PaymentMethodsPage } from './payment-methods.page';
import { RouterModule, Routes } from '@angular/router';
import { MethodComponent } from './components/method/method.component';
import { SharedPaymentsModule } from '../shared-payments/shared-payments.module';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodsPage,
  },
];
@NgModule({
  imports: [SharedPaymentsModule, RouterModule.forChild(routes)],
  declarations: [PaymentMethodsPage, MethodComponent],
})
export class PaymentMethodsPageModule {}
