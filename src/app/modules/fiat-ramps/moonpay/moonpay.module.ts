import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationStatusChipComponent } from '../shared-ramps/components/operation-status-chip/operation-status-chip.component';
import { OperationsListAccordionComponent } from '../shared-ramps/components/operations-list-accordion/operations-list-accordion.component';
import { OperationsListItemComponent } from '../shared-ramps/components/operations-list-item/operations-list-item.component';
import { OperationsListComponent } from '../shared-ramps/components/operations-list/operations-list.component';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { MoonpayPage } from './moonpay.page';

const routes: Routes = [
  {
    path: '',
    component: MoonpayPage,
  },
  {
    path: ':asset',
    component: MoonpayPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [MoonpayPage, OperationsListComponent, OperationStatusChipComponent, OperationsListAccordionComponent, OperationsListItemComponent],
})
export class MoonpayPageModule {}
