import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedSwapsModule } from '../shared-swaps/shared-swaps.module';
import { SwapSelectTokenPage } from './swap-select-token.page';


const routes: Routes = [
  {
    path: 'blockchain/:blockchain/from-token/:fromToken/to-token/:toToken/token-to-select/:tokenToSelect/from-token-amount/:fromTokenAmount',
    component: SwapSelectTokenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedSwapsModule],
  declarations: [SwapSelectTokenPage]
})
export class SwapSelectTokenPageModule {}
