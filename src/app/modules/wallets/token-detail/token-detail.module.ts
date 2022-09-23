import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { TokenDetailPage } from './token-detail.page';

const routes: Routes = [
  {
    path: 'blockchain/:blockchain/token/:token',
    component: TokenDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [TokenDetailPage],
})
export class TokenDetailPageModule {}
