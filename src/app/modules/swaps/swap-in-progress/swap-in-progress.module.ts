import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedSwapsModule } from '../shared-swaps/shared-swaps.module';
import { SwapInProgressPage } from './swap-in-progress.page';

const routes: Routes = [
  {
    path: '',
    component: SwapInProgressPage
  }
];

@NgModule({
  imports: [SharedSwapsModule, RouterModule.forChild(routes)],
  exports: [SwapInProgressPage],
  declarations: [SwapInProgressPage]
})
export class SwapInProgressPageModule {}
