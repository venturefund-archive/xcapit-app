import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';
import { SupportWalletConnectPage } from './support-wallet-connect.page';

const routes: Routes = [
  {
    path: '',
    component: SupportWalletConnectPage,
  },
];

@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [SupportWalletConnectPage],
})
export class SupportWalletConnectPageModule {}
