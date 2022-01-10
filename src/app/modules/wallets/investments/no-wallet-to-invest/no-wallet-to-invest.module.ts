import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from 'src/app/modules/fiat-ramps/shared-ramps/shared-ramps.module';
import { NoWalletToInvestPage } from './no-wallet-to-invest.page';

const routes: Routes = [
  {
    path: '',
    component: NoWalletToInvestPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [NoWalletToInvestPage],
})
export class NoWalletToInvestPageModule {}
