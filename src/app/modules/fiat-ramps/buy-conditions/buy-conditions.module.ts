import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { BuyConditionsPage } from './buy-conditions.page';

const routes: Routes = [
  {
    path: '',
    component: BuyConditionsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedRampsModule],
  declarations: [BuyConditionsPage],
})
export class BuyConditionsPageModule {}
