import { NgModule } from '@angular/core';
import { PaymentSuccessPage } from './payment-success.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PaymentSuccessPage,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [PaymentSuccessPage],
})
export class PaymentSuccessPageModule {}
