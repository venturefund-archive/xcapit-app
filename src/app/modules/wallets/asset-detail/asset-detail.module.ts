import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { AssetDetailPage } from './asset-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AssetDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [AssetDetailPage],
})
export class AssetDetailPageModule {}
