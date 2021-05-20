import { NgModule } from '@angular/core';
import { PaymentMethodsPage } from './payment-methods.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MethodComponent } from './components/method/method.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodsPage
  }
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PaymentMethodsPage, MethodComponent]
})
export class PaymentMethodsPageModule {}
