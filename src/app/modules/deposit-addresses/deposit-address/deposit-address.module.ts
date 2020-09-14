import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositAddressPage } from './deposit-address.page';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DepositAddressPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [DepositAddressPage]
})
export class DepositAddressPageModule {}
