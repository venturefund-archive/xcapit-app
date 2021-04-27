import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundTimelineDetailPage } from './fund-timeline-detail.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundTimelineDetailPage
  }
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundTimelineDetailPage],
  entryComponents: []
})
export class FundTimelineDetailPageModule {}
