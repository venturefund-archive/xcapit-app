import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RunSummaryPage } from './run-summary.page';
import { SharedRunsModule } from '../shared-runs/shared-runs.module';

const routes: Routes = [
  {
    path: '',
    component: RunSummaryPage
  }
];

@NgModule({
  imports: [SharedRunsModule, RouterModule.forChild(routes)],
  declarations: [RunSummaryPage]
})
export class RunSummaryPageModule {}
