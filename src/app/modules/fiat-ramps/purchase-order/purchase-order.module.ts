import { NgModule } from '@angular/core';
import { PurchaseOrderPage } from './purchase-order.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: ':step',
    component: PurchaseOrderPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedRampsModule
  ],
  declarations: [PurchaseOrderPage]
})

export class PurchaseOrderPageModule {}