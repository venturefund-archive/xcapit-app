import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HasWallet } from 'src/app/shared/guards/has-wallet/has-wallet';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';


export const defaultSwapsUrls = {
  swapHome: [
    'swaps/home/blockchain',
    'MATIC',
    'from-token',
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    'to-token',
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
  ]
}


const routes: Routes = [
  {
    path: 'swaps',
    canActivate: [AuthGuard, HasWallet],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./swap-home/swap-home.module').then((m) => m.SwapHomePageModule),
      },
      {
        path: 'select-currency',
          loadChildren: () => import('./swap-select-token/swap-select-token.module').then( m => m.SwapSelectTokenPageModule)
      },
      {
        path: 'swap-in-progress',
        loadChildren: () => import('./swap-in-progress/swap-in-progress.module').then( m => m.SwapInProgressPageModule)
      }
    ],
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwapsRoutingModule {}
