import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsDetailPage } from './operations-detail.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: OperationsDetailPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [OperationsDetailPage],
})
export class OperationsDetailPageModule {}
