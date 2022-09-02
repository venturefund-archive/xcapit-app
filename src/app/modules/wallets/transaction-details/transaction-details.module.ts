import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { TransactionDetailsPage } from './transaction-details.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [TransactionDetailsPage]
})
export class TransactionDetailsPageModule {}
