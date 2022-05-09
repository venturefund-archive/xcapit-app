import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsDetailPage } from './operations-detail.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { OperationDetailCardComponent } from '../shared-ramps/components/operation-detail-card/operation-detail-card.component';

const routes: Routes = [
  {
    path: '',
    component: OperationsDetailPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [OperationsDetailPage, OperationDetailCardComponent],
})
export class OperationsDetailPageModule {}
