import { NgModule } from '@angular/core';
import { FundInvestmentInfoPage } from './fund-investment-info.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundInvestmentInfoPage,
  },
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundInvestmentInfoPage],
})
export class FundInvestmentInfoPageModule {}
