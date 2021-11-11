import { NgModule } from '@angular/core';
import { WalletTermsOptionsPage } from './wallet-terms-options.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';

const routes: Routes = [
  {
    path: '',
    component: WalletTermsOptionsPage,
  },
];
@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  declarations: [WalletTermsOptionsPage],
})
export class WalletTermsOptionsPageModule {}
