import { NgModule } from '@angular/core';
import { WalletTermsPage } from './wallet-terms.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';
const routes: Routes = [
  {
    path: '',
    component: WalletTermsPage,
  },
];
@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  declarations: [WalletTermsPage],
})
export class WalletTermsPageModule {}
