import { NgModule } from '@angular/core';
import { OperationsNewPaxfulPage } from './operations-new-paxful.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { PaxfulRecordatoryCardComponent } from '../shared-ramps/components/paxful-recordatory-card/paxful-recordatory-card.component';

const routes: Routes = [
  {
    path: '',
    component: OperationsNewPaxfulPage,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [OperationsNewPaxfulPage, PaxfulRecordatoryCardComponent],
})
export class OperationsNewPaxfulPageModule {}
