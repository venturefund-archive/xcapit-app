import { NgModule } from '@angular/core';

import { NewSuccessWalletPage } from './new-success-wallet.page';
import { SharedTicketsModule } from '../shared-tickets/shared-tickets.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [{ path: '', component: NewSuccessWalletPage }];
@NgModule({
  imports: [SharedTicketsModule, RouterModule.forChild(routes)],
  declarations: [NewSuccessWalletPage],
})
export class NewSuccessWalletPageModule {}
