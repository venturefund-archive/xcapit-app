import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositCurrencyPage } from './deposit-currency.page';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DepositCurrencyPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [DepositCurrencyPage]
})
export class DepositCurrencyPageModule {}
