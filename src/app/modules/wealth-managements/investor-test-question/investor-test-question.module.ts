import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWealthManagementsModule } from '../shared-wealth-managements/shared-wealth-managements.module';
import { InvestorTestQuestionPage } from './investor-test-question.page';

const routes: Routes = [
  {
    path: '',
    component: InvestorTestQuestionPage,
  },
  {
    path: ':question',
    component: InvestorTestQuestionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWealthManagementsModule],
  declarations: [InvestorTestQuestionPage],
})
export class InvestorTestQuestionPageModule {}
