import { NgModule } from '@angular/core';
import { HomeFinancialEducationPage } from './home-financial-education.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialEducationModule } from '../shared-financial-education/shared-financial-education.module';

const routes: Routes = [
  {
    path: '',
    component: HomeFinancialEducationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFinancialEducationModule],
  declarations: [HomeFinancialEducationPage],
})
export class HomeFinancialEducationPageModule {}
