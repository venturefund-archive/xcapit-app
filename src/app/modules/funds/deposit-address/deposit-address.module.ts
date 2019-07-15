import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositAddressPage } from './deposit-address.page';
import { IonicModule } from '@ionic/angular';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: DepositAddressPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [DepositAddressPage]
})
export class DepositAddressPageModule {}
