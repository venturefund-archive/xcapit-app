import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendSummaryPage } from './send-summary.page';

const routes: Routes = [
  {
    path: '',
    component: SendSummaryPage,
  },
  {
    path: ':mode',
    component: SendSummaryPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendSummaryPageRoutingModule {}
