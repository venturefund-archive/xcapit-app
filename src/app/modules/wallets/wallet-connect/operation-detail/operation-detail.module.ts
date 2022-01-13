import { NgModule } from '@angular/core';
import { OperationDetailPage } from './operation-detail.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: OperationDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [OperationDetailPage],
})
export class OperationDetailPageModule {}
