import { NgModule } from '@angular/core';
import { ExplanationPage } from './explanation.page';
import { SharedFinancialEducationModule } from '../../shared-financial-education/shared-financial-education.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ExplanationPage,
  },
  {
    path: ':mode',
    component: ExplanationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFinancialEducationModule],
  declarations: [ExplanationPage],
})
export class ExplanationPageModule {}
