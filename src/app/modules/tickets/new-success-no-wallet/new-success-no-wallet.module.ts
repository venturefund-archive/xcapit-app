import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedTicketsModule } from '../shared-tickets/shared-tickets.module';

import { NewSuccessNoWalletPage } from './new-success-no-wallet.page';
const routes: Routes = [{path: '', component: NewSuccessNoWalletPage}]
@NgModule({
  imports: [
    SharedTicketsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewSuccessNoWalletPage]
})
export class NewSuccessNoWalletPageModule {}
