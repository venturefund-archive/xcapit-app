import { NgModule } from '@angular/core';
import { NoWalletPage } from './no-wallet.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: NoWalletPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [NoWalletPage],
})
export class NoWalletPageModule {}
