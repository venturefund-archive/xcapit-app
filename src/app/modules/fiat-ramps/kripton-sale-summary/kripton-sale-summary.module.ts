import { NgModule } from '@angular/core';
import { KriptonSaleSummaryPage } from './kripton-sale-summary.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: KriptonSaleSummaryPage,
  },
];

@NgModule({
  imports: [
    SharedRampsModule, RouterModule.forChild(routes)
  ],
  declarations: [KriptonSaleSummaryPage]
})
export class KriptonSaleSummaryPageModule {}
