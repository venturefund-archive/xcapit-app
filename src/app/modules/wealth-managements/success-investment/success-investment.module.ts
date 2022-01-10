import { NgModule } from '@angular/core';
import { SuccessInvestmentPage } from './success-investment.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWealthManagementsModule } from '../shared-wealth-managements/shared-wealth-managements.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessInvestmentPage,
  },
];

@NgModule({
  imports: [SharedWealthManagementsModule ,RouterModule.forChild(routes)],
  declarations: [SuccessInvestmentPage],
})
export class SuccessInvestmentPageModule {}
