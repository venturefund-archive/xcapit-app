import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedSwapsModule } from '../shared-swaps/shared-swaps.module';
import { SwapHomePage } from './swap-home.page';


const routes: Routes = [
  {
    path: 'blockchain/:blockchain/from-token/:fromToken/to-token/:toToken',
    component: SwapHomePage,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes), SharedSwapsModule],
  declarations: [SwapHomePage]
})
export class SwapHomePageModule {}
