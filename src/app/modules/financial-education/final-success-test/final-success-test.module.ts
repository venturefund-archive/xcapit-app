import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialEducationModule } from '../shared-financial-education/shared-financial-education.module';
import { FinalSuccessTestPage } from './final-success-test.page';

const routes: Routes = [
  {
    path: '',
    component: FinalSuccessTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFinancialEducationModule],
  declarations: [FinalSuccessTestPage]
})
export class FinalSuccessTestPageModule {}
