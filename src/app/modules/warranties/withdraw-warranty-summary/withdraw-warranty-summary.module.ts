import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { WithdrawWarrantySummaryPage } from './withdraw-warranty-summary.page';

const routes: Routes = [
  {
    path: '',
    component: WithdrawWarrantySummaryPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [WithdrawWarrantySummaryPage],
})
export class WithdrawWarrantySummaryPageModule {}
