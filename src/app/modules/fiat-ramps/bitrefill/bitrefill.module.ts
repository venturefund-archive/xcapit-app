import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { BitrefillPage } from './bitrefill.page';

const routes: Routes = [
  {
    path: ':paymentMethod',
    component: BitrefillPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [BitrefillPage],
})
export class BitrefillPageModule {}
