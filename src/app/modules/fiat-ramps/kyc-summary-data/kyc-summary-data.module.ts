import { NgModule } from '@angular/core';
import { KycSummaryDataPage } from './kyc-summary-data.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: KycSummaryDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedRampsModule],
  declarations: [KycSummaryDataPage]
})
export class KycSummaryDataPageModule {}
