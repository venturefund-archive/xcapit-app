import { NgModule } from '@angular/core';
import { InvestmentsTabPage } from './investments-tab.page';
import { RouterModule } from '@angular/router';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes = [
  {
    path: '',
    component: InvestmentsTabPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFundsModule],
  declarations: [InvestmentsTabPage],
})
export class InvestmentsTabPageModule {}
