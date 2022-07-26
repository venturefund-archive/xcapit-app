import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedSwapsModule } from '../shared-swaps/shared-swaps.module';
import { SwapTermsAndConditionsPage } from './swap-terms-and-conditions.page';

const routes: Routes = [
  {
    path: '',
    component: SwapTermsAndConditionsPage
  }
];

@NgModule({
  imports: [SharedSwapsModule, RouterModule.forChild(routes)],
  exports: [SwapTermsAndConditionsPage],
  declarations: [SwapTermsAndConditionsPage]
})
export class SwapTermsAndConditionsPageModule {}
