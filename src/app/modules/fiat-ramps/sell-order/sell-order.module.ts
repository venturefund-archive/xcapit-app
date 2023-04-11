import { NgModule } from '@angular/core';

import { SellOrderPage } from './sell-order.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: SellOrderPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [SellOrderPage],
})
export class SellOrderPageModule {}
