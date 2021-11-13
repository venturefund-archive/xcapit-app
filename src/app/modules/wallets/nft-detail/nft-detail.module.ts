import { NgModule } from '@angular/core';
import { NftDetailPage } from './nft-detail.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
const routes: Routes = [
  {
    path: '',
    component: NftDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [NftDetailPage],
})
export class NftDetailPageModule {}
