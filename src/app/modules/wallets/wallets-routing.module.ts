import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'wallets',
    children: [
      {
        path: 'test',
        canActivate: [],
        loadChildren: () => import('./test-wallet/test-wallet.module').then((m) => m.TestWalletPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletsRoutingModule {}
