import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { BitrefillTokenSelectionPage } from './bitrefill-token-selection.page';

const routes: Routes = [
  {
    path: '',
    component: BitrefillTokenSelectionPage,
  },
];
@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],

  declarations: [BitrefillTokenSelectionPage]
})
export class BitrefillTokenSelectionPageModule {}
