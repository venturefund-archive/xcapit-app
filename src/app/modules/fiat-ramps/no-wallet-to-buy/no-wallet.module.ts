import { NgModule } from '@angular/core';
import { NoWalletToBuyPage } from './no-wallet-to-buy.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: NoWalletToBuyPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [NoWalletToBuyPage],
})
export class NoWalletToBuyPageModule {}
