import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../shared-defi-investments/shared-defi-investments.module';
import { NoWalletToInvestPage } from './no-wallet-to-invest.page';

const routes: Routes = [
  {
    path: '',
    component: NoWalletToInvestPage,
  },
];

@NgModule({
  imports: [SharedDefiInvestmentsModule, RouterModule.forChild(routes)],
  declarations: [NoWalletToInvestPage],
})
export class NoWalletToInvestPageModule {}
