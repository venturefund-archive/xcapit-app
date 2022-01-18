import { NgModule } from '@angular/core';
import { ConnectionDetailPage } from './connection-detail.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: ConnectionDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [ConnectionDetailPage],
})
export class ConnectionDetailPageModule {}
