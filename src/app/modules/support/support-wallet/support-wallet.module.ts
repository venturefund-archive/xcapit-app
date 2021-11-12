import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';
import { SupportWalletPage } from './support-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: SupportWalletPage,
  },
];
@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  declarations: [SupportWalletPage],
})
export class SupportWalletPageModule {}
