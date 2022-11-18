import { NgModule } from '@angular/core';
import { KriptonOperationDetailPage } from './kripton-operation-detail.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: KriptonOperationDetailPage,
  },
];
@NgModule({
  imports: [
    SharedRampsModule, RouterModule.forChild(routes)
  ],
  declarations: [KriptonOperationDetailPage]
})
export class KriptonOperationDetailPageModule {}
