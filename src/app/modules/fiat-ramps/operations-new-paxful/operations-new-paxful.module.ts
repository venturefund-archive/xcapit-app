import { NgModule } from '@angular/core';
import { OperationsNewPaxfulPage } from './operations-new-paxful.page';
import { RouterModule, Routes } from '@angular/router';
import { PaxfulRecordatoryCardComponent } from '../shared-ramps/components/paxful-recordatory-card/paxful-recordatory-card.component';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: OperationsNewPaxfulPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [OperationsNewPaxfulPage, PaxfulRecordatoryCardComponent],
})
export class OperationsNewPaxfulPageModule {}
