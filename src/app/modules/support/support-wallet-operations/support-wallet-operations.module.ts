import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';
import { SupportWalletOperationsPage } from './support-wallet-operations.page';

const routes: Routes = [
  {
    path: '',
    component: SupportWalletOperationsPage
  }
];

@NgModule({
  imports: [
     [SharedSupportModule, RouterModule.forChild(routes)],
  ],
  declarations: [SupportWalletOperationsPage]
})
export class SupportWalletOperationsPageModule {}
