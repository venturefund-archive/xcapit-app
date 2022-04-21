import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsPagePage } from './operations-page.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { OperationsListComponent } from '../shared-ramps/components/operations-list/operations-list.component';
import { OperationStatusChipComponent } from '../shared-ramps/components/operation-status-chip/operation-status-chip.component';
import { OperationsListAccordionComponent } from '../shared-ramps/components/operations-list-accordion/operations-list-accordion.component';
import { OperationsListItemComponent } from '../shared-ramps/components/operations-list-item/operations-list-item.component';

const routes: Routes = [
  {
    path: '',
    component: OperationsPagePage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [OperationsPagePage, OperationsListComponent, OperationStatusChipComponent, OperationsListAccordionComponent, OperationsListItemComponent],
})
export class OperationsPagePageModule {}
